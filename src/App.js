import Listings from './components/Listings'

function App() {
  return (
    <div className='App'>
      <Listings title='Recently Sold' options={{ sold: true }} />
      <Listings title='Recently Listed' options={{ sold: false }} />
    </div>
  )
}

export default App
