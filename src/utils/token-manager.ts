import axios from 'axios'

let cachedToken = {
  accessToken: '',
  expiresAt: Date.now(),
}

async function getNewAccessToken() {
  const { CLIENT_ID, CLIENT_SECRET } = process.env
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      'Missing required environment variables: CLIENT_ID and CLIENT_SECRET'
    )
  }

  const params = new URLSearchParams()
  params.append('client_id', CLIENT_ID)
  params.append('client_secret', CLIENT_SECRET)
  params.append('grant_type', 'client_credentials')

  const response = await axios.post('https://id.twitch.tv/oauth2/token', params)
  const { access_token, expires_in } = response.data

  cachedToken = {
    accessToken: access_token,
    expiresAt: Date.now() + expires_in * 1000,
  }
}

export async function getToken() {
  const isTokenExpired =
    !cachedToken.accessToken || cachedToken.expiresAt < Date.now() + 60000

  if (isTokenExpired) {
    await getNewAccessToken()
  }

  return cachedToken.accessToken
}
