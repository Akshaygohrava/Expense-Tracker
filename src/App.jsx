import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import Login from './pages/Login'


const App = () => {
  return (
    <>
      <div className='min-h-screen bg-gray-100'>
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/add' element={<AddExpense />} />
            <Route path='/login' element={<Login />} />
          </Routes> 
        </div>
      </div>
    </>
  )
}

export default App