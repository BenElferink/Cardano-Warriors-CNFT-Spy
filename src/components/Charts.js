import React, { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { MenuItem, Select } from '@mui/material'
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import Chart from 'react-apexcharts'
import Header from './Header'
import Footer from './Footer'
import styles from '../styles/Charts.module.css'

const chartWidthSubstractDesktop = 750
const chartWidthSubstractMobile = 70

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

  const generateChartWidth = () =>
    window.innerWidth - (isDesktop ? chartWidthSubstractDesktop : chartWidthSubstractMobile)

  const [selectedType, setSelectedType] = useLocalStorage('selectedType', 'mage')
  const [expandToMonth, setExpandToMonth] = useLocalStorage('expandToMonth', false)
  const [chartData, setChartData] = useState(generateChartData(selectedType, expandToMonth))
  const [chartWidth, setChartWidth] = useState(generateChartWidth())

  useEffect(() => {
    setChartData(generateChartData(selectedType, expandToMonth))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, expandToMonth])

  useEffect(() => {
    const handler = () => setChartWidth(generateChartWidth())
    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.root}>
      <Header />

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

      <Footer isDesktop={isDesktop} />
    </div>
  )
}

export default Charts