import getDates from './getDates'

function getLineOptions(floorData, isMonth) {
  const options = {
    chart: {
      id: 'floor-chart-lines',
      type: 'line',
      stacked: false,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      // type: 'datetime',
      categories: getDates(floorData, isMonth),
    },
  }

  return options
}

export default getLineOptions
