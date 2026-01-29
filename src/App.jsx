import React from 'react'
import {BrowserRouter as Router ,Routes,Route} from "react-router-dom"
import Register from './Pages/Register'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard.jsx'
import Apply from './Pages/Apply.jsx'
// import ProtectedRoutes from './Components/ProtectedRoutes'
const App = () => {
  return (
  <>
  <Router>
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login'element={<Login/>}/>
   {/* <Route path='/' element={<ProtectedRoutes>
    <Dashboard/>
   </ProtectedRoutes>}/> */}
   <Route path='/' element={<Dashboard/>}/>
   <Route path='/apply/:id' element={<Apply/>}/>
    </Routes>
  </Router>
  </>
  )
}

export default App
