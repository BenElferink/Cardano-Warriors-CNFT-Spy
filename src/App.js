import { useEffect, useState } from 'react'
import Axios from 'axios'
import { useMediaQuery } from '@mui/material'
import Listings from './components/Listings'
import Main from './components/Main'
import { FLOOR_DATA_URL, WARRIOR_DATA_URL } from './constants'

function App() {
  const [warriorsData, setWarrirosData] = useState(null)
  const [floorData, setFloorData] = useState(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    Axios.get(WARRIOR_DATA_URL)
      .then((response) => setWarrirosData(response.data))
      .catch((error) => console.error(error))

    Axios.get(FLOOR_DATA_URL)
      .then((response) => setFloorData(response.data))
      .catch((error) => console.error(error))
  }, [])

  if (isDesktop) {
    return (
      <div className='App'>
        <Listings title='Recently Listed' options={{ sold: false }} />
        <Main warriorsData={warriorsData} floorData={floorData} isDesktop />
        <Listings title='Recently Sold' options={{ sold: true }} />
      </div>
    )
  }

  return (
    <div className='App'>
      <Main warriorsData={warriorsData} floorData={floorData} isDesktop={false} />
      <Listings title='Recently Listed' options={{ sold: false }} />
      <Listings title='Recently Sold' options={{ sold: true }} />
    </div>
  )
}

export default App
