import React, { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { MenuItem, Select } from '@mui/material'
import Chart from 'react-apexcharts'
import Toggle from './Toggle'
import styles from '../styles/Charts.module.css'

const chartWidthSubstractDesktop = 750
const chartWidthSubstractMobile = 70

function Charts({ warriorsData, floorData, isDesktop }) {
  const generateTypeChartData = (warriorType, showMonth) => {
    const prices = floorData[warriorType].map((obj) => obj.floor)

    if (showMonth) {
      while (prices.length < 30) prices.unshift(0)
      while (prices.length > 30) prices.shift()
    } else {
      while (prices.length < 7) prices.unshift(0)
      while (prices.length > 7) prices.shift()
    }

    const dates = floorData[warriorType].map((obj) => {
      const timestamp = new Date(obj.timestamp)
      const month = timestamp.getMonth()
      const day = timestamp.getDate()

      return `${month + 1}/${day}`
    })

    if (showMonth) {
      while (dates.length < 30) dates.unshift(0)
      while (dates.length > 30) dates.shift()
    } else {
      while (dates.length < 7) dates.unshift(0)
      while (dates.length > 7) dates.shift()
    }

    return {
      options: {
        chart: {
          id: 'floor-chart',
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: false,
          },
        },
        xaxis: {
          // type: 'datetime',
          categories: dates,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
          },
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

  const generateRarityChartData = (rarityLevel, showMonth) => {
    const warriorList = warriorsData.warriors.filter(({ rarity_level }) => rarity_level === rarityLevel)

    const series = warriorList.map(({ type }) => {
      const payload = {
        name: type,
        data: floorData[type].map((obj) => obj.floor),
      }

      if (showMonth) {
        while (payload.data.length < 30) payload.data.unshift(0)
        while (payload.data.length > 30) payload.data.shift()
      } else {
        while (payload.data.length < 7) payload.data.unshift(0)
        while (payload.data.length > 7) payload.data.shift()
      }

      return payload
    })

    const dates = floorData[warriorList[0].type].map((obj) => {
      const timestamp = new Date(obj.timestamp)
      const month = timestamp.getMonth()
      const day = timestamp.getDate()

      return `${month + 1}/${day}`
    })

    if (showMonth) {
      while (dates.length < 30) dates.unshift(0)
      while (dates.length > 30) dates.shift()
    } else {
      while (dates.length < 7) dates.unshift(0)
      while (dates.length > 7) dates.shift()
    }

    return {
      series,
      options: {
        chart: {
          id: 'floor-chart',
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
          },
        },
        xaxis: {
          // type: 'datetime',
          categories: dates,
        },
      },
    }
  }

  const generateChartWidth = () =>
    window.innerWidth - (isDesktop ? chartWidthSubstractDesktop : chartWidthSubstractMobile)

  const [showThirtyDay, setShowThirtyDay] = useState(false)
  const [showByRarity, setShowByRarity] = useState(false)

  const [selectedType, setSelectedType] = useLocalStorage('selectedType', 'mage')
  const [selectedRarity, setSelectedRarity] = useLocalStorage('selectedRarity', 3)

  const [chartWidth, setChartWidth] = useState(generateChartWidth())
  const [chartData, setChartData] = useState(
    showByRarity
      ? generateRarityChartData(selectedRarity, showThirtyDay)
      : generateTypeChartData(selectedType, showThirtyDay),
  )

  useEffect(() => {
    setChartData(
      showByRarity
        ? generateRarityChartData(selectedRarity, showThirtyDay)
        : generateTypeChartData(selectedType, showThirtyDay),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showThirtyDay, showByRarity, selectedType, selectedRarity])

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
          <Select value={selectedRarity} onChange={(e) => setSelectedRarity(Number(e.target.value))}>
            {Object.entries(warriorsData.rarities).map(([key, val]) => (
              <MenuItem key={key} value={key}>
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
