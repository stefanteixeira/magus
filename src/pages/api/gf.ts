import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { HEADERS } from '@/constants/headers'
import { debug } from '@/utils/debug'

const extractGFUrl = (href: string) => {
  const url = new URL(`https://google.com${href}`)
  let gfUrl = url.searchParams.get('q')
  const gfSummaryPattern =
    /^(https:\/\/gamefaqs\.gamespot\.com\/[^/]+\/[^/]+)(\/|$)/
  const match = gfUrl?.match(gfSummaryPattern)

  return match ? match[1] : ''
}

const searchGame = async (name: string, platform: string): Promise<string> => {
  const searchQuery = `${name} ${platform} gamefaqs`
  const searchUrl = `https://google.com/search?q=${encodeURIComponent(
    searchQuery
  )}`
  debug('Search URL:', searchUrl)
  const response = await axios.get(searchUrl)
  const $ = cheerio.load(response.data)
  let gamePageLink = $('a[href*="gamefaqs.gamespot.com"]').first().attr('href')

  if (!gamePageLink) {
    throw new Error('Game not found')
  } else if (gamePageLink.startsWith('/url')) {
    gamePageLink = extractGFUrl(gamePageLink) as string
    debug('GF game page link:', gamePageLink)
  }

  return gamePageLink
}

const fetchGameDetails = async (
  url: string
): Promise<{ difficulty: string; length: string }> => {
  const response = await axios.get(url, {
    headers: HEADERS,
    withCredentials: true,
  })
  const $ = cheerio.load(response.data)
  const difficulty = $('#gs_difficulty_avg_hint')
    .text()
    .replace(/\(\d+\)/, '')
    .trim()
  const lengthText = $('#gs_length_avg_hint').text()
  const match = lengthText.match(/(\d+)\s*Hours/)
  const length = match ? match[1] : ''

  return { difficulty, length }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, platform } = req.query

  try {
    const gameUrl = await searchGame(name as string, platform as string)
    const gameDetails = await fetchGameDetails(gameUrl)
    debug('Game difficulty:', gameDetails.difficulty)
    debug('Game length:', gameDetails.length)

    res.status(200).json(gameDetails)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching game details', error })
  }
}
