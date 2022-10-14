import React, { memo, ReactNode, useCallback, useEffect, useState } from 'react'
import Message from './components/Message'
import MessageContext from './contexts/MessageContext'
import ScoreContext from './contexts/ScoreContext'
import Editor from './Editor'

let timer: number | undefined

const star = (
  <svg
    className="icon"
    viewBox="0 0 1134 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
  >
    <path
      d="M1048.653198 449.907958L848.355771 645.157082l47.261731 275.685416a63.913117 63.913117 0 0 1-25.449857 62.598956 63.94517 63.94517 0 0 1-67.422889 4.888039l-247.591211-130.150056-247.623263 130.150056a64.025302 64.025302 0 0 1-92.872746-67.486995l47.26173-275.685416L61.62184 449.907958a64.009275 64.009275 0 0 1 35.466331-109.171553l276.85534-40.242186 123.803619-250.828534A63.961196 63.961196 0 0 1 555.153545 13.974984c24.344038 0 46.60465 13.830747 57.406416 35.690701l123.771566 250.828534 276.85534 40.242186a64.009275 64.009275 0 1 1 35.466331 109.171553zM693.813598 358.990427L555.153545 77.98426 416.46144 358.990427 106.319353 404.072573l224.40107 218.727739-52.999167 308.876005 277.432289-145.823835 277.400237 145.823835-52.999167-308.876005 224.40107-218.727739L693.813598 358.990427z m92.15156 508.724693l-230.811613-121.335559-192.604774 101.238506a21.315057 21.315057 0 0 1-9.920316 2.548191 21.427241 21.427241 0 0 1-8.173443-41.251846l210.698533-110.742137 174.158437 91.558586-33.27072-193.967016 140.919769-137.345891-15.032725-2.179584a21.411215 21.411215 0 0 1 2.916798-42.598061c1.634689 0 3.189245 0.224369 4.727775 0.576949l99.107 14.407696-186.787206 182.027378 44.072485 257.062788z m-69.586448-426.958213c-0.70516 0-1.346214-0.128211-2.019321-0.208342v0.064105l-1.330188-0.208342c-0.400659-0.064105-0.833371-0.064105-1.218003-0.160264l-69.570421-10.096606-87.087232-176.482258-87.119284 176.482258-194.720254 28.270496 140.887717 137.345891-21.747769 127.040943-0.096158-0.032053a21.411215 21.411215 0 0 1-42.485876-3.573877c0-2.035348 0.35258-3.958511 0.88145-5.833595l17.628994-102.712931L181.563106 428.624954l258.15258-37.517705 115.437859-233.856621 115.43786 233.856621 48.14318 7.019545c10.73766 1.185951 19.087393 10.160711 19.087393 21.202872 0 11.827452-9.567736 21.427241-21.443268 21.427241z"
      fill="#ffd140"
    ></path>
  </svg>
)

const LOCAL_SCORE = 'local_score'

const localData = localStorage.getItem(LOCAL_SCORE)
let localScore = Number(localData)
if (Number.isNaN(localScore)) {
  localScore = 0
}

const App: React.FC = () => {
  const [show, setShow] = useState(false)
  const [score, setScore] = useState(localScore)
  const [messageContent, setMessageContent] = useState<ReactNode | null>(null)
  const showMessage = useCallback((content: ReactNode, duration = 3) => {
    clearTimeout(timer)
    setShow(true)
    setMessageContent(content)
    timer = setTimeout(() => {
      setShow(false)
      setMessageContent(null)
    }, duration * 1000)
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_SCORE, score.toString())
  }, [score])

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      <MessageContext.Provider value={showMessage}>
        <h1 className="text-center">记忆大师</h1>
        <h2 className="text-center">积分 : {score}</h2>
        <div className="min-h-8 flex justify-center items-center flex-wrap">
          {Array.from({ length: score }).map((s) => star)}
        </div>
        <div className="container mx-auto" id="app">
          <Editor />
        </div>
        {show && messageContent != null && <Message>{messageContent}</Message>}
      </MessageContext.Provider>
    </ScoreContext.Provider>
  )
}

export default memo(App)
