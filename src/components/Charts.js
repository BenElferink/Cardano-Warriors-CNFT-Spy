import React, { useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks'
import { MenuItem, Select } from '@mui/material'
import Chart from 'react-apexcharts'
import Toggle from './Toggle'
import styles from '../styles/Charts.module.css'
import { getBarOptions, getLineOptions, getRaritySeries, getTypeSeries } from '../functions'

function Charts({ warriorsData, floorData, isDesktop }) {
  const generateChartWidth = (width = window.innerWidth) => width - (isDesktop ? 750 : 70)
  const [chartWidth, setChartWidth] = useState(generateChartWidth())

  useEffect(() => {
    const handler = () => setChartWidth(generateChartWidth())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, []) // eslint-disable-line

  const [showThirtyDay, setShowThirtyDay] = useState(false)
  const [showByRarity, setShowByRarity] = useState(false)
  const [selectedType, setSelectedType] = useLocalStorage('selectedType', 'mage')
  const [selectedRarity, setSelectedRarity] = useLocalStorage('selectedRarity', 3)

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

      <Chart
        width={chartWidth}
        type='line'
        options={getLineOptions(floorData, showThirtyDay)}
        series={
          showByRarity
            ? getRaritySeries(floorData, warriorsData, selectedRarity, showThirtyDay)
            : getTypeSeries(floorData[selectedType], showThirtyDay)
        }
      />
    </section>
  )
}

export default Charts
