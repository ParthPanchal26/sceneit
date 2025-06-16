import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {Home, MovieDetails} from './pages/index.js'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sceneit/' element={<Home />} />
        <Route path='/sceneit/movie-details/:id' element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App