import { DIFFICULTY } from '@/constants/difficulty'

const fetchGameDifficulty = async (
  name: string,
  platform: string,
  setGameDifficultyData: React.Dispatch<React.SetStateAction<number | null>>,
  setGameDifficultyError: React.Dispatch<React.SetStateAction<string>>
) => {
  setGameDifficultyError('')

  try {
    const response = await fetch(
      `/api/gf?name=${encodeURIComponent(name)}&platform=${encodeURIComponent(
        platform
      )}`
    )
    const data = await response.json()

    if (data && data.difficulty && data.difficulty !== 'Unrated') {
      const difficultyKey = Object.keys(DIFFICULTY).find(
        (key) =>
          DIFFICULTY[Number(key) as keyof typeof DIFFICULTY] === data.difficulty
      )
      setGameDifficultyData(difficultyKey ? Number(difficultyKey) : null)
    } else {
      setGameDifficultyData(null)
      setGameDifficultyError('No game difficulty data found')
      setTimeout(() => setGameDifficultyError(''), 3000)
    }
  } catch (error: any) {
    setGameDifficultyError(
      error.message || 'Error fetching game difficulty data'
    )
    setTimeout(() => setGameDifficultyError(''), 3000)
  }
}

export default fetchGameDifficulty
