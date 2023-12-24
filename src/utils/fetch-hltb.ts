const formatHltbData = (data: number) => {
  return data % 1 === 0 ? String(data) : data.toFixed(1)
}

const fetchHltbData = async (
  name: string,
  platform: string,
  setHltbData: React.Dispatch<React.SetStateAction<string>>,
  setHltbError: React.Dispatch<React.SetStateAction<string>>
) => {
  setHltbError('')

  try {
    const hltbResponse = await fetch(
      `/api/hltb?name=${encodeURIComponent(name)}`
    )
    const hltbData = await hltbResponse.json()

    if (
      hltbData &&
      (hltbData.gameplayMain > 0 || hltbData.gameplayMainExtra > 0)
    ) {
      const formattedData =
        hltbData.gameplayMain > 0
          ? formatHltbData(hltbData.gameplayMain)
          : formatHltbData(hltbData.gameplayMainExtra)

      setHltbData(formattedData)
    } else {
      // Fetch game length from GF if HLTB data is not available
      const gfResponse = await fetch(
        `/api/gf?name=${encodeURIComponent(name)}&platform=${encodeURIComponent(
          platform
        )}`
      )
      const gfData = await gfResponse.json()

      if (gfData && gfData.length) {
        setHltbData(gfData.length)
      } else {
        setHltbData('')
        setHltbError('No HLTB data found')
        setTimeout(() => setHltbError(''), 3000)
      }
    }
  } catch (error: any) {
    setHltbError(error.message)
    setTimeout(() => setHltbError(''), 3000)
  }
}

export default fetchHltbData
