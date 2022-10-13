import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  EditorState,
  SerializedLexicalNode,
  ElementNode,
} from 'lexical'
import React, { memo, useCallback, useEffect, useState } from 'react'
import Modal from './components/Modal'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { $createHeadingNode } from '@lexical/rich-text'

dayjs.extend(duration)

interface CountdownProps {
  minutes: number
  onTimeout: () => void
}

const Countdown: React.FC<CountdownProps> = ({ minutes, onTimeout }) => {
  const [remain, setRemain] = useState(minutes * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setRemain((p) => p - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (remain <= 0) {
      onTimeout()
    }
  }, [onTimeout, remain])

  const time = dayjs.duration(remain, 'second').format('mm:ss')

  return <div className="mr-1 text-neutral-500">{time}</div>
}

const EndBtn: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const [open, setOpen] = useState(false)

  const onConfirm = () => {
    onEnd()
  }

  const footer = (
    <div className="modal-footer">
      <button className="btn mr-1 primary" onClick={onConfirm}>
        Confirm
      </button>
      <button className="btn" onClick={() => setOpen(false)}>
        Close
      </button>
    </div>
  )

  return (
    <>
      <button className="btn small" onClick={() => setOpen(true)}>
        End
      </button>
      {open && (
        <Modal title="END" footer={footer} onClose={() => setOpen(false)}>
          <div>END</div>
        </Modal>
      )}
    </>
  )
}

const ToolBarAction: React.FC = () => {
  const [editor] = useLexicalComposerContext()
  const [started, setStarted] = useState(false)
  const [open, setOpen] = useState(false)
  const [minutes, setMinutes] = useState(10)
  const [scale, setScale] = useState(20)
  const [answers, setAnswers] = useState<string[]>([])
  const [prevEditorState, setPrevEditorState] = useState<EditorState | null>(
    null
  )
  const updateEditorContent = () => {
    editor.update(() => {
      // Get the RootNode from the EditorState
      const root = $getRoot()
      if (root.canBeEmpty()) {
        root.clear()
      }
      // Create a new ParagraphNode
      const paragraphNode = $createParagraphNode()
      // Create a new TextNode
      const textNode = $createTextNode('Hello world')
      // Append the text node to the paragraph
      paragraphNode.append(textNode)
      // Finally, append the paragraph to the root
      root.append(paragraphNode)
    })
  }

  const onConfirm = () => {
    const editorState = editor.getEditorState()
    setPrevEditorState(editorState)
    console.log(editorState.toJSON())
    editor.update(() => {
      const content = editorState.toJSON()
      const root = $getRoot()
      if (root.canBeEmpty()) {
        root.clear()
      }
      const contentRoot = content.root.children
      const stores: string[] = []
      const appendContent = (nodes: any[], parentNode: ElementNode) => {
        nodes.forEach((node) => {
          if (node.type === 'text') {
            if (node.format !== 0) {
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              const underlineText = ' '.repeat(node.text.length + 2)
              stores.push(node.text)
              const text = $createTextNode(underlineText).setFormat('underline')
              parentNode.append(text)
            } else {
              const text = $createTextNode(node.text)
              parentNode.append(text)
            }
          } else if (node.children != null && node.children.length > 0) {
            const paragraph = $createParagraphNode()
            appendContent(node.children, paragraph)
            parentNode.append(paragraph)
          }
        })
      }
      appendContent(contentRoot, root)
      setStarted(true)
      setAnswers(stores)
      setOpen(false)
    })
  }

  const onEnd = useCallback(() => {
    console.log('onEnd')
    editor.update(() => {
      const root = $getRoot()
      const heading = $createHeadingNode('h2')
      heading.append($createTextNode('答案'))
      root.append(heading)
      const paragraph = $createParagraphNode()
      answers.forEach((answer, index) => {
        paragraph.append($createTextNode(`${index + 1} ${answer} `))
      })
      root.append(paragraph)
      setStarted(false)
    })
  }, [answers, editor])

  const footer = (
    <div className="modal-footer">
      <button className="btn mr-1 primary" onClick={onConfirm}>
        Confirm
      </button>
      <button className="btn" onClick={() => setOpen(false)}>
        Close
      </button>
    </div>
  )

  if (started) {
    return (
      <>
        <Countdown minutes={minutes} onTimeout={onEnd} />
        <EndBtn onEnd={onEnd} />
      </>
    )
  }

  return (
    <>
      <button className="btn small" onClick={() => setOpen(true)}>
        Start
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)} title="开始" footer={footer}>
          <form>
            <div className="form-row">
              <label htmlFor="minutes">时 间</label>
              <input
                id="minutes"
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                min={1}
                className="input"
              />
              <span>&nbsp;min</span>
            </div>
            <div className="form-row">
              <label htmlFor="cowbell">比 例</label>
              <input
                className="input-range"
                type="range"
                id="cowbell"
                name="cowbell"
                min="0"
                max="100"
                step="10"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              />
              <span className="w-6 text-right">{scale}%</span>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

export default memo(ToolBarAction)
