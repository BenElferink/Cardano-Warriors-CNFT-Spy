import React, { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { MenuItem, Select } from '@mui/material'
import Chart from 'react-apexcharts'
import Toggle from './Toggle'
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

  const [showThirtyDay, setShowThirtyDay] = useState(false)
  const [showByRarity, setShowByRarity] = useState(false)
  const [selectedType, setSelectedType] = useLocalStorage('selectedType', 'mage')
  const [selectedRarity, setSelectedRarity] = useLocalStorage('selectedRarity', 'epic')
  const [chartData, setChartData] = useState(generateChartData(selectedType, showThirtyDay))
  const [chartWidth, setChartWidth] = useState(generateChartWidth())

  useEffect(() => {
    setChartData(generateChartData(selectedType, showThirtyDay))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, showThirtyDay])

  useEffect(() => {
    const handler = () => setChartWidth(generateChartWidth())
    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className={styles.chartContainer}>
      <div className={styles.controls}>
        <div className={styles.toggleWrap}>
          <Toggle
            name='chart-days'
            labelLeft='7d'
            labelRight='30d'
            state={{
              value: showThirtyDay,
              setValue: setShowThirtyDay,
            }}
          />
          <Toggle
            name='chart-type'
            labelLeft='type'
            labelRight='rarity'
            state={{
              value: showByRarity,
              setValue: setShowByRarity,
            }}
          />
        </div>

        {showByRarity ? (
          <Select value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value)}>
            {Object.entries(warriorsData.rarities).map(([key, val]) => (
              <MenuItem key={key} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {warriorsData.warriors.map((obj) => (
              <MenuItem key={obj.type} value={obj.type}>
                {obj.type} - {warriorsData.rarities[obj.rarity_level]}
              </MenuItem>
            ))}
          </Select>
        )}
      </div>

      <Chart options={chartData.options} series={chartData.series} type='bar' width={chartWidth} />
    </section>
  )
}

export default Charts
