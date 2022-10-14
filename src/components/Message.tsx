import React, { memo, PropsWithChildren } from 'react'

import { createPortal } from 'react-dom'

const success = (
  <svg
    className="w-6 h-6 text-white fill-current"
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
  </svg>
)

const MessageCard: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2  ">
      <div className="flex shadow overflow-hidden rounded-lg bg-white h-8">
        <div className="flex items-center justify-center w-12 bg-emerald-500  ">
          {success}
        </div>
        <div className="px-4 leading-8 -mx-3">
          <div className="mx-3">
            <p className="text-neutral-800">{children}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  duration?: number
}

const Message: React.FC<PropsWithChildren<Props>> = ({
  children,
  duration = 3000,
}) => {
  return createPortal(<MessageCard>{children}</MessageCard>, document.body)
}

export default memo(Message)
