import React, { memo } from 'react'
import Editor from './Editor'

const App: React.FC = () => {
  return (
    <div className="container">
      <Editor />
    </div>
  )
}

export default memo(App)
