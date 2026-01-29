import React from 'react'
import {BrowserRouter as Router ,Routes,Route} from "react-router-dom"
import Register from './Pages/Register'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import ProtectedRoutes from './Components/ProtectedRoutes'
const App = () => {
  return (
  <>
  <Router>
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login'element={<Login/>}/>
   <Route path='/dashboard' element={<ProtectedRoutes>
    <Dashboard/>
   </ProtectedRoutes>}/>
    </Routes>
  </Router>
  </>
  )
}

export default App
