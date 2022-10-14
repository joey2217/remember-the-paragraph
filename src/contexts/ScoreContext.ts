import { createContext } from 'react'

export interface ScoreContextProps {
  score: number
  setScore: any
}

const ScoreContext = createContext<ScoreContextProps>({
  score: 0,
  setScore: (value: number) => undefined,
})

export default ScoreContext
