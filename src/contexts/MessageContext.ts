import { createContext, ReactNode } from 'react'

export type ShowMessage = (content: ReactNode, duration?: number) => void

const MessageContext = createContext<ShowMessage>(
  (content: ReactNode) => undefined
)

export default MessageContext
