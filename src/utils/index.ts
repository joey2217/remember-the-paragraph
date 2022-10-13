const punctuationReg = /[。？！，、；：“ ” ‘ ’——]/
const MIN_TEXT_NUM = 6

export function generateTextParts(text: string, percent: number) {
  const ratio = percent / 100
  const textList = text.split(punctuationReg).filter((t) => t !== '')
  const result: string[] = []
  textList.forEach((t) => {
    if (t.length > MIN_TEXT_NUM) {
      const halfLength = Math.floor(t.length / 2)
      const startIndex = getRandomInt(0, halfLength)
      const step = getRandomInt(0, halfLength)
      const start = t.substring(0, startIndex)
      if (start !== '') {
        result.push(start)
      }
      const blank = ' '.repeat(step)
      result.push(blank)
      const end = t.substring(startIndex + step)
      if (end !== '') {
        result.push(end)
      }
    } else {
      result.push(t)
    }
  })
  return result
}

//  生成 [n,m)，包含n但不包含m的正整数：
const getRandomInt = (n: number, m: number) =>
  Math.floor(Math.random() * (m - n) + n)
