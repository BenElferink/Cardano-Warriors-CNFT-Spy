import Listings from './components/Listings'

function App() {
  return (
    <div className='App'>
      <Listings title='Recently Listed' options={{ sold: false }} />
      <Listings title='Recently Sold' options={{ sold: true }} />
    </div>
  )
}

export default App
