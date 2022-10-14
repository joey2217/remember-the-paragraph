import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  ElementNode,
  CLEAR_EDITOR_COMMAND,
} from 'lexical'
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import Modal from './components/Modal'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { $createHeadingNode } from '@lexical/rich-text'
import MessageContext from './contexts/MessageContext'
import ScoreContext from './contexts/ScoreContext'

dayjs.extend(duration)

const LOCAL_CONTENT = 'local_content'

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

// const EndBtn: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
//   const [open, setOpen] = useState(false)

//   const onConfirm = () => {
//     onEnd()
//   }

//   const footer = (
//     <div className="modal-footer">
//       <button className="btn mr-1 primary" onClick={onConfirm}>
//         Confirm
//       </button>
//       <button className="btn" onClick={() => setOpen(false)}>
//         Close
//       </button>
//     </div>
//   )

//   return (
//     <>
//       <button className="btn small" onClick={() => setOpen(true)}>
//         End
//       </button>
//       {open && (
//         <Modal title="END" footer={footer} onClose={() => setOpen(false)}>
//           <div>END</div>
//         </Modal>
//       )}
//     </>
//   )
// }

const ToolBarAction: React.FC = () => {
  const [editor] = useLexicalComposerContext()
  const showMessage = useContext(MessageContext)
  const { setScore } = useContext(ScoreContext)
  const [started, setStarted] = useState(false)
  const [open, setOpen] = useState(false)
  // const [minutes, setMinutes] = useState(10)
  const [answers, setAnswers] = useState<string[]>([])

  // const updateEditorContent = () => {
  //   editor.update(() => {
  //     // Get the RootNode from the EditorState
  //     const root = $getRoot()
  //     if (root.canBeEmpty()) {
  //       root.clear()
  //     }
  //     // Create a new ParagraphNode
  //     const paragraphNode = $createParagraphNode()
  //     // Create a new TextNode
  //     const textNode = $createTextNode('Hello world')
  //     // Append the text node to the paragraph
  //     paragraphNode.append(textNode)
  //     // Finally, append the paragraph to the root
  //     root.append(paragraphNode)
  //   })
  // }

  const onStart = () => {
    const editorState = editor.getEditorState()
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
    })
  }

  const onEnd = useCallback(() => {
    console.log('onEnd')
    const editorState = editor.getEditorState()
    editor.update(() => {
      const root = $getRoot()
      const content = editorState.toJSON()
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
              stores.push(node.text.trim())
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
      const heading = $createHeadingNode('h2')
      heading.append($createTextNode('答案'))
      root.append(heading)
      const paragraph = $createParagraphNode()
      let allRight = true
      answers.forEach((answer, index) => {
        let textContent = `${index + 1}:${answer} ❌`
        if (answer === stores[index]) {
          textContent = `${index + 1} ${answer} ✔️`
        } else {
          allRight = false
        }
        paragraph.append($createTextNode(textContent))
      })
      root.append(paragraph)
      setStarted(false)
      if (allRight) {
        showMessage('恭喜你答对了!')
        setScore(s => s + 1)
      }
    })
  }, [answers, editor, setScore, showMessage])

  const onConfirm = useCallback(() => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)
    editor.focus()
    setOpen(false)
  }, [editor])

  const footer = (
    <div className="modal-footer">
      <button className="btn mr-1 primary" onClick={onConfirm}>
        确认
      </button>
      <button className="btn" onClick={() => setOpen(false)}>
        取消
      </button>
    </div>
  )

  const onSave = () => {
    localStorage.setItem(LOCAL_CONTENT, JSON.stringify(editor.getEditorState()))
    showMessage('暂存成功!')
  }

  return (
    <>
      <button
        className="btn small clear mr-2"
        title="Clear"
        aria-label="Clear editor contents"
        onClick={() => setOpen(true)}
      >
        <i className="clear" />
      </button>
      {open && (
        <Modal title="清空" footer={footer} onClose={() => setOpen(false)}>
          <div>确认清空所有内容?</div>
        </Modal>
      )}
      <button className="btn small mr-2" title="暂存" onClick={onSave}>
        暂存
      </button>
      {started ? (
        <>
          <Countdown minutes={10} onTimeout={onEnd} />
          <button className="btn small" onClick={onEnd}>
            结束
          </button>
        </>
      ) : (
        <button className="btn small" onClick={onStart}>
          开始
        </button>
      )}
    </>
  )
}

export default memo(ToolBarAction)
