import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <>
         <nav className="bg-white shadow-md p-4 flex justify-between item-center">
            <h1 className="text-x1 font-bold text-blue-600">
                Expanse Tracker
            </h1>
           <div className="space-x-4">
                <Link to="/" className="text-grey-700 hover:text-blue-600">Home</Link>
                <Link to="/add" className="text-grey-700 hover:text-blue-600">Add Expanse</Link>
                <Link to="/login" className="text-grey-700 hover:text-blue-600">Login</Link>
            </div>
         </nav>
            
        </>
    )
}

export default Navbar;