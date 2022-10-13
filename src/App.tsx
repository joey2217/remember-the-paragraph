import React, { memo } from 'react'
import Editor from './Editor'

const App: React.FC = () => {
  return (
    <div className="container mx-auto" id="app">
      <Editor />
    </div>
  )
}

export default memo(App)
