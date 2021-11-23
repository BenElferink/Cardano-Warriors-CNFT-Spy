import { MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import Chart from 'react-apexcharts'
import styles from '../styles/Charts.module.css'
import logo from '../assets/images/cw-logo.png'

const chartWidthSubstractDesktop = 750
const chartWidthSubstractMobile = 100

function Charts({ warriorsData, floorData, isDesktop }) {
  const generateChartData = (warriorType, showMonth) => {
    const dates = floorData[warriorType].map((obj) => {
      const timestamp = new Date(obj.timestamp)
      const month = timestamp.getMonth()
      const day = timestamp.getDate()

      return `${month + 1}/${day}`
    })
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
  const [chartWidth, setChartWidth] = useState(
    window.innerWidth - (isDesktop ? chartWidthSubstractDesktop : chartWidthSubstractMobile),
  )

  useEffect(() => {
    setChartData(generateChartData(selectedType, expandToMonth))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, expandToMonth])

  useEffect(() => {
    const handler = () =>
      setChartWidth(window.innerWidth - (isDesktop ? chartWidthSubstractDesktop : chartWidthSubstractMobile))
    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <img src={logo} alt='logo' />
      </header>

      <section className={styles.chartContainer}>
        <div className={styles.controls}>
          <label className={styles.toggle}>
            <span>7d</span>
            <Toggle
              icons={false}
              defaultChecked={expandToMonth}
              onChange={() => setExpandToMonth((prev) => !prev)}
            />
            <span>30d</span>
          </label>

          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {warriorsData.warriors.map((obj) => (
              <MenuItem key={obj.type} value={obj.type}>
                {obj.type} - {warriorsData.rarities[obj.rarity_level]}
              </MenuItem>
            ))}
          </Select>
        </div>

        <Chart options={chartData.options} series={chartData.series} type='bar' width={chartWidth} />
      </section>
    </div>
  )
}

export default Charts
