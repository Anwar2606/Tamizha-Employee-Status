import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaUser, FaChartBar, FaSignOutAlt, FaClock, FaTasks, FaFile } from "react-icons/fa";
import "./Sidebar.css";
import { FcDataSheet } from "react-icons/fc";
import { RiCheckboxCircleFill } from "react-icons/ri";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Closed by default on mobile

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="mobile-toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar">
          <div className="sidebar-title">
            <h2>Tamizha</h2>
          </div>
          <ul className="sidebar-menu">
            <li>
              <Link to="/dashboard" className="sidebar-link" onClick={() => setIsOpen(false)}>
                <FaHome className="icon" />
                <span className="menu-text">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/clickup" className="sidebar-link" onClick={() => setIsOpen(false)}>
                <FaTasks className="icon" />
                <span className="menu-text">Click up</span>
              </Link>
            </li>
            <li>
              <Link to="/trackabi" className="sidebar-link" onClick={() => setIsOpen(false)}>
                <FaClock className="icon" />
                <span className="menu-text">Trackabi</span>
              </Link>
            </li>
            <li>
              <Link to="/workdone" className="sidebar-link" onClick={() => setIsOpen(false)}>
                <FaFile className="icon" />
                <span className="menu-text">Workdone</span>
              </Link>
            </li>
            <li>
              <Link to="/dailyattendance" className="sidebar-link" onClick={() => setIsOpen(false)}>
              <RiCheckboxCircleFill className="icon"/>
                <span className="menu-text">Attandance</span>
              </Link>
            </li>
            <li>
              <Link to="/employeelist" className="sidebar-link" onClick={() => setIsOpen(false)}>
                <FaUser className="icon" />
                <span className="menu-text">Employees</span>
              </Link>
            </li>
            <li className="logout-item">
              <Link to="/logout" className="sidebar-link" onClick={() => setIsOpen(false)}>
                <FaSignOutAlt className="icon" />
                <span className="menu-text">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
