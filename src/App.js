import { useEffect, useState } from 'react'
import Axios from 'axios'
import Listings from './components/Listings'
import { FLOOR_DATA_URL, WARRIOR_DATA_URL } from './constants'
import FloorCharts from './components/FloorCharts'

function App() {
  const [warriorsData, setWarrirosData] = useState(null)
  const [floorData, setFloorData] = useState(null)

  useEffect(() => {
    Axios.get(WARRIOR_DATA_URL)
      .then((response) => setWarrirosData(response.data))
      .catch((error) => console.error(error))

    Axios.get(FLOOR_DATA_URL)
      .then((response) => setFloorData(response.data))
      .catch((error) => console.error(error))
  }, [])

  return (
    <div className='App'>
      <Listings title='Recently Listed' options={{ sold: false }} />

      {warriorsData && floorData && <FloorCharts warriorsData={warriorsData} floorData={floorData} />}

      <Listings title='Recently Sold' options={{ sold: true }} />
    </div>
  )
}

export default App
