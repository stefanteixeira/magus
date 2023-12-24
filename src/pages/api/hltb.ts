import { debug } from '@/utils/debug'
import { HowLongToBeatService } from 'howlongtobeat'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const hltbService = new HowLongToBeatService()
  const { name } = req.query

  try {
    const results = await hltbService.search(name as string)

    debug('HLTB API response:', results)

    let hltbData: {
      gameplayMain: number | null
      gameplayMainExtra: number | null
    } = {
      gameplayMain: null,
      gameplayMainExtra: null,
    }

    if (results.length > 0) {
      hltbData = {
        gameplayMain: results[0].gameplayMain,
        gameplayMainExtra: results[0].gameplayMainExtra,
      }
    }

    res.status(200).json(hltbData)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching HLTB data', error })
  }
}
