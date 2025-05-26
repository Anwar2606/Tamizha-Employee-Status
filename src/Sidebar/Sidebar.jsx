import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaClock,
  FaTasks,
  FaFile,
} from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";  // Adjust path as needed
import "./Sidebar.css";
import { TbWorld } from "react-icons/tb";
import { MdOutlineAnalytics } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [employeeNames, setEmployeeNames] = useState([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setReportDropdownOpen(!reportDropdownOpen);
  };

  const toggleEmployeeDropdown = () => {
    setEmployeeDropdownOpen(!employeeDropdownOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    setReportDropdownOpen(false);
    setEmployeeDropdownOpen(false);
  };

  // Fetch employees from Firestore on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employees"));
        const names = [];
        querySnapshot.forEach((doc) => {
          // Assuming employee document has a "name" field
          names.push(doc.data().name);
        });
        setEmployeeNames(names);
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <>
      <button className="mobile-toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar">
          <div className="sidebar-title">
            <h2>Infeara</h2>
          </div>
          <ul className="sidebar-menu">
            <li>
              <Link to="/dashboard" className="sidebar-link" onClick={closeSidebar}>
                <FaHome className="icon" />
                <span className="menu-text">Home</span>
              </Link>
            </li>
             
            <li>
              <Link to="/website-clients" className="sidebar-link" onClick={closeSidebar}>
                <TbWorld className="icon" />
                <span className="menu-text">Website Clients</span>
              </Link>
            </li>
             <li>
              <Link to="/dm-clients" className="sidebar-link" onClick={closeSidebar}>
                <MdOutlineAnalytics  className="icon" />
                <span className="menu-text">DM Clients</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/workdone" className="sidebar-link" onClick={closeSidebar}>
                <FaFile className="icon" />
                <span className="menu-text">Workdone</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to="/dailyattendance" className="sidebar-link" onClick={closeSidebar}>
                <RiCheckboxCircleFill className="icon" />
                <span className="menu-text">Attendance</span>
              </Link>
            </li> */}
          <li className="dropdown-item">
              <div className="sidebar-link" onClick={toggleEmployeeDropdown}>
                <FaUser className="icon" />
                <span className="menu-text">Tasks</span>
                <span className="dropdown-arrow">{employeeDropdownOpen ? "▲" : "▼"}</span>
              </div>
              {employeeDropdownOpen && (
                <ul className="dropdown-submenu">
                  {employeeNames.length > 0 ? (
                    employeeNames.map((name, index) => (
                      <li key={index}>
                    <Link
  to={`/view-task?employee=${encodeURIComponent(name)}`}
  className="sidebar-link sub"
  onClick={closeSidebar}
>
  {name}
</Link>

                      </li>
                    ))
                  ) : (
                    <li className="sidebar-link sub">Loading...</li>
                  )}
                </ul>
              )}
            </li>
            {/* Monthly Report with Dropdown */}
            {/* <li className="dropdown-item">
              <div className="sidebar-link" onClick={toggleDropdown}>
                <IoCalendarNumberSharp className="icon" />
                <span className="menu-text">All Reports</span>
                <span className="dropdown-arrow">{reportDropdownOpen ? "▲" : "▼"}</span>
              </div>
              {reportDropdownOpen && (
                <ul className="dropdown-submenu">
                  <li>
                    <Link to="/monthlyattendance" className="sidebar-link sub" onClick={closeSidebar}>
                      Monthly Report
                    </Link>
                  </li>
                  <li>
                    <Link to="/attendancereport" className="sidebar-link sub" onClick={closeSidebar}>
                      Daily Attendance
                    </Link>
                  </li>
                  <li>
                    <Link to="/workdonereport" className="sidebar-link sub" onClick={closeSidebar}>
                      Daily Work Done
                    </Link>
                  </li>
                  <li>
                    <Link to="/clickupreport" className="sidebar-link sub" onClick={closeSidebar}>
                      Daily Click Up
                    </Link>
                  </li>
                  <li>
                    <Link to="/trackabireport" className="sidebar-link sub" onClick={closeSidebar}>
                      Daily Trackabi
                    </Link>
                  </li>
                </ul>
              )}
            </li> */}

            {/* Employee Dropdown */}
           

            <li className="logout-item">
              <Link to="/logout" className="sidebar-link" onClick={closeSidebar}>
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
