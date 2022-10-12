import React, { memo, useState } from 'react'
import Modal from './components/Modal'
import Editor from './Editor'

const App: React.FC = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="container mx-auto">
      <button onClick={(e) => setOpen(true)}>open</button>
      <Editor />
      {open && (
        <Modal onClose={() => setOpen(false)} title={'666'}>
          <p>123</p>
          <input id="number" type="number" />
          <input
            type="range"
            id="cowbell"
            name="cowbell"
            min="0"
            max="100"
            step="10"
          />
          <label htmlFor="cowbell">Cowbell</label>
        </Modal>
      )}
    </div>
  )
}

export default memo(App)
