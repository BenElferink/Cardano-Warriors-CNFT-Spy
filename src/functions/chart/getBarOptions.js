import getDates from './getDates'

function getBarOptions(floorData, isMonth) {
  const options = {
    chart: {
      id: 'floor-chart-bars',
      type: 'bar',
      stacked: true,
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
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
      },
    },
  }

  return options
}

export default getBarOptions
