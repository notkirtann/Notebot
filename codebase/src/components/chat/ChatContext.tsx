'use client'

import {
  ReactNode,
  createContext,
  useRef,
  useState,
} from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'

type StreamResponse = {
  addMessage: () => void
  message: string
  handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  isLoading: boolean
}

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false,
})

interface Props {
  fileId: string
  children: ReactNode
}

export const ChatContextProvider = ({
  fileId,
  children,
}: Props) => {
  /* ----------------------------- State ----------------------------- */
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const backupMessage = useRef('')
  const utils = trpc.useContext()
  const { toast } = useToast()

  /* --------------------------- Mutation ---------------------------- */
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const res = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({ fileId, message }),
      })

      if (!res.ok) {
        throw new Error('Failed to send message')
      }

      return res.body
    },

    /**
     * Optimistic update:
     * 1. Cancel in-flight queries
     * 2. Snapshot previous messages
     * 3. Insert user message immediately
     */
    onMutate: async ({ message }) => {
      backupMessage.current = message
      setMessage('')

      await utils.getFileMessages.cancel()

      const previousMessages =
        utils.getFileMessages.getInfiniteData()

      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return { pages: [], pageParams: [] }
          }

          const newPages = [...old.pages]
          const latestPage = newPages[0]!

          latestPage.messages = [
            {
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ]

          newPages[0] = latestPage

          return { ...old, pages: newPages }
        }
      )

      setIsLoading(true)

      return {
        previousMessages:
          previousMessages?.pages.flatMap(
            (p) => p.messages
          ) ?? [],
      }
    },

    /**
     * Stream AI response chunk-by-chunk and
     * progressively update the message text.
     */
    onSuccess: async (stream) => {
      setIsLoading(false)

      if (!stream) {
        return toast({
          title: 'Message failed',
          description:
            'Please refresh the page and try again.',
          variant: 'destructive',
        })
      }

      const reader = stream.getReader()
      const decoder = new TextDecoder()

      let done = false
      let accumulatedResponse = ''

      while (!done) {
        const { value, done: doneReading } =
          await reader.read()
        done = doneReading

        accumulatedResponse += decoder.decode(value)

        utils.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) return { pages: [], pageParams: [] }

            const aiExists = old.pages.some((page) =>
              page.messages.some(
                (m) => m.id === 'ai-response'
              )
            )

            const updatedPages = old.pages.map(
              (page, idx) => {
                if (idx !== 0) return page

                const messages = aiExists
                  ? page.messages.map((m) =>
                      m.id === 'ai-response'
                        ? { ...m, text: accumulatedResponse }
                        : m
                    )
                  : [
                      {
                        id: 'ai-response',
                        createdAt:
                          new Date().toISOString(),
                        text: accumulatedResponse,
                        isUserMessage: false,
                      },
                      ...page.messages,
                    ]

                return { ...page, messages }
              }
            )

            return { ...old, pages: updatedPages }
          }
        )
      }
    },

    /**
     * Rollback optimistic update on error
     */
    onError: (_, __, context) => {
      setMessage(backupMessage.current)

      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [] }
      )
    },

    onSettled: async () => {
      setIsLoading(false)
      await utils.getFileMessages.invalidate({ fileId })
    },
  })

  /* --------------------------- Handlers ---------------------------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(e.target.value)
  }

  const addMessage = () => {
    if (!message.trim()) return
    sendMessage({ message })
  }

  /* ---------------------------- Context ---------------------------- */
  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}>
      {children}
    </ChatContext.Provider>
  )
}
