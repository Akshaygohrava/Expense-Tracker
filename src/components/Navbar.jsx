import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold block py-2 px-4 rounded bg-blue-100'
      : 'text-gray-700 block py-2 px-4 rounded hover:bg-gray-100';

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Expense Tracker</h1>
        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="hidden sm:flex space-x-6">
          <NavLink to="/" className={navLinkStyle}>Dashboard</NavLink>
          <NavLink to="/add" className={navLinkStyle}>Add Expense</NavLink>
          <NavLink to="/login" className={navLinkStyle}>Login</NavLink>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden mt-2 border-t pt-2">
          <NavLink to="/" className={navLinkStyle} onClick={toggleMenu}>Dashboard</NavLink>
          <NavLink to="/add" className={navLinkStyle} onClick={toggleMenu}>Add Expense</NavLink>
          <NavLink to="/login" className={navLinkStyle} onClick={toggleMenu}>Login</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;