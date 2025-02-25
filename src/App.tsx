import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Signin from './Pages/Auth/login'
import './App.scss'
import Register from './Pages/Auth/register'
import Forgot from './Pages/Auth/forgot'
import Reset from './Pages/Auth/reset'
import Pages from './Pages'

import './style/style.scss'
import Otp from './Pages/Auth/otp'
function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='/forgetpassword' element={<Forgot />} />
          <Route path='/register' element={<Register />} />
          <Route path='/otp' element={<Otp />} />
          <Route path='/reset' element={<Reset />} />
          <Route path='/dashboard/*' element={<Pages />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
