import { Link, NavLink } from 'react-router-dom';


const Navbar = () => {
    return (
        <>
         <nav className="bg-white shadow-md p-4 flex justify-between item-center">
            <h1 className="text-x1 font-bold text-blue-600">
                Expanse Tracker
            </h1>
             <div className="space-x-4">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600"}>
            Dashboard
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600"}>
            Add Expense
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600"}>
            Login
          </NavLink>
        </div>
         </nav>
            
        </>
    )
}

export default Navbar;