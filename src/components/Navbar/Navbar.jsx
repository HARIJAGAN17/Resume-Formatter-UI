import './Navbar.css';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-icon">
            <FaHome />
          </Link>
        </div>
        <ul className="navbar-menu">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/login" className="nav-link">Login</Link></li>
          <li><Link to="/register" className="nav-link">Register</Link></li>
        </ul>
        <div className="navbar-right">
          <Link to="/login"><button className="btn login-btn">Login</button></Link>
          <Link to="/register"><button className="btn signup-btn">Sign up</button></Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
