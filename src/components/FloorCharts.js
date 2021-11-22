import { MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import Chart from 'react-apexcharts'
import styles from '../styles/Charts.module.css'

// https://www.npmjs.com/package/react-apexcharts
// https://apexcharts.com/docs/react-charts/

const COLORS = [
  'rgb(102, 178, 255)',
  'rgb(60, 179, 113)',
  'rgb(0, 0, 0)',
  'rgb(245, 69, 3)',
  'rgb(102, 0, 204)',
  'rgb(102, 0, 204)',
]

function FloorCharts({ warriorsData, floorData }) {
  const generateChartData = (warriorType, showMonth) => {
    const dates = floorData[warriorType].map((obj) =>
      new Date(obj.timestamp).toLocaleDateString().replace(`/${new Date().getFullYear()}`, ''),
    )
    const prices = floorData[warriorType].map((obj) => obj.floor)

    if (showMonth) {
      while (dates.length < 30) dates.unshift(0)
      while (prices.length < 30) prices.unshift(0)
    } else {
      while (dates.length < 7) dates.unshift(0)
      while (prices.length < 7) prices.unshift(0)
    }

    return {
      options: {
        chart: {
          id: `floor-chart-${warriorType}`,
        },
        xaxis: {
          categories: dates,
        },
      },
      series: [
        {
          name: `floor-chart-${warriorType}`,
          data: prices,
        },
      ],
    }
  }

  const [selectedType, setSelectedType] = useState('mage')
  const [expandToMonth, setExpandToMonth] = useState(false)
  const [chartData, setChartData] = useState(generateChartData(selectedType, expandToMonth))

  useEffect(() => {
    setChartData(generateChartData(selectedType, expandToMonth))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, expandToMonth])

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {warriorsData.warriors.map((obj) => (
            <MenuItem key={obj.type} value={obj.type}>
              {obj.type} - {warriorsData.rarities[obj.rarity_level]}
            </MenuItem>
          ))}
        </Select>

        <label className={styles.toggle}>
          <span>7d</span>
          <Toggle
            icons={false}
            defaultChecked={expandToMonth}
            onChange={() => setExpandToMonth((prev) => !prev)}
          />
          <span>30d</span>
        </label>
      </div>

      <Chart options={chartData.options} series={chartData.series} type='bar' width='500' />
    </div>
  )
}

export default FloorCharts
