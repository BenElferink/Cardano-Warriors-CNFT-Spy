function getRaritySeries(floorData, warriorsData, rarityLevel, isMonth) {
  const warriorList = warriorsData.warriors.filter(({ rarity_level }) => rarity_level === rarityLevel)

  const series = warriorList
    .map(({ type }) => {
      const payload = {
        name: type,
        data: floorData[type].map((obj) => obj.floor),
      }

      if (isMonth) {
        while (payload.data.length < 30) payload.data.unshift(0)
        while (payload.data.length > 30) payload.data.shift()
      } else {
        while (payload.data.length < 7) payload.data.unshift(0)
        while (payload.data.length > 7) payload.data.shift()
      }

      return payload
    })
    .sort((a, b) => a.data[0] - b.data[0])

  return series
}

export default getRaritySeries
