import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Dashboard.css";
import backgroundImage from "../assets/allbg.jpg";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Dashboard = () => {
  const [attendanceTableData, setAttendanceTableData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  });

  const [clickupYesCount, setClickupYesCount] = useState(0);
  const [clickupNoCount, setClickupNoCount] = useState(0);

  const [trackabiYesCount, setTrackabiYesCount] = useState(0);
  const [trackabiNoCount, setTrackabiNoCount] = useState(0);

  const [workdoneYesCount, setWorkdoneYesCount] = useState(0);
  const [workdoneNoCount, setWorkdoneNoCount] = useState(0);

  const [totalEmployeesCount, setTotalEmployeesCount] = useState(0); // 👈 New state for total employees

  const calculateTotalHours = (entryTime, leavingTime) => {
    if (!entryTime || !leavingTime) return "0.00";

    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return new Date(0, 0, 0, hours, minutes);
    };

    const start = parseTime(entryTime);
    const end = parseTime(leavingTime);
    const diffMs = end - start;

    const diffHrs = Math.floor(diffMs / 1000 / 60 / 60);
    const diffMins = Math.floor((diffMs / 1000 / 60) % 60);

    return `${diffHrs}.${diffMins.toString().padStart(2, "0")}`;
  };

  const fetchAttendance = async (dateStr) => {
    try {
      const formattedDate = dateStr.split("-").reverse().join("-");
      const q = query(collection(db, "attendance"), where("date", "==", formattedDate));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => {
        const record = doc.data();
        const totalHours = calculateTotalHours(record.entryTime, record.leavingTime);
        return { ...record, totalHours };
      });
      setAttendanceTableData(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const fetchTotalEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));
      setTotalEmployeesCount(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching total employees:", error);
    }
  };

  const fetchClickupStatus = async (dateStr) => {
    try {
      const formattedDate = dateStr.split("-").reverse().join("-");
      const q = query(collection(db, "clickup"), where("date", "==", formattedDate));
      const querySnapshot = await getDocs(q);
      let yes = 0;
      let no = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "yes") yes++;
        else if (data.status === "no") no++;
      });
      setClickupYesCount(yes);
      setClickupNoCount(no);
    } catch (error) {
      console.error("Error fetching ClickUp status:", error);
    }
  };

  const fetchTrackabiStatus = async (dateStr) => {
    try {
      const formattedDate = dateStr.split("-").reverse().join("-");
      const q = query(collection(db, "trackabi"), where("date", "==", formattedDate));
      const querySnapshot = await getDocs(q);
      let yes = 0;
      let no = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "yes") yes++;
        else if (data.status === "no") no++;
      });
      setTrackabiYesCount(yes);
      setTrackabiNoCount(no);
    } catch (error) {
      console.error("Error fetching Trackabi status:", error);
    }
  };

  const fetchWorkdoneStatus = async (dateStr) => {
    try {
      const formattedDate = dateStr.split("-").reverse().join("-");
      const q = query(collection(db, "workdone"), where("date", "==", formattedDate));
      const querySnapshot = await getDocs(q);
      let yes = 0;
      let no = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "yes") yes++;
        else if (data.status === "no") no++;
      });
      setWorkdoneYesCount(yes);
      setWorkdoneNoCount(no);
    } catch (error) {
      console.error("Error fetching Workdone status:", error);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
    fetchClickupStatus(selectedDate);
    fetchTrackabiStatus(selectedDate);
    fetchWorkdoneStatus(selectedDate);
    fetchTotalEmployees(); // 👈 Fetch total employees once
  }, [selectedDate]);

    const presentCount = attendanceTableData.filter(
    (record) => record.status === "Present"
  ).length;

  const halfDayCount = attendanceTableData.filter(
    (record) => record.status === "Half Day"
  ).length;

  const absentCount = totalEmployeesCount - presentCount - halfDayCount;

  const tardyCount = attendanceTableData.filter(
    (record) => record.status === "Tardy"
  ).length;

  const cardData = [
    // {
    //   id: 1,
    //   title: "Click Up",
    //   imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJrSxyKnMBdmFOrMr6qTrkGwWB0rP5oa2V0w&s",
    //   completed: clickupYesCount,
    //   incomplete: clickupNoCount,
    // },
    {
      id: 2,
      title: "Trackabi Timer",
      imageUrl: "https://trackabi.com/img/front/press-kit/Trackabi-Logo-Square.svg",
      completed: trackabiYesCount,
      incomplete: trackabiNoCount,
    },
    {
      id: 3,
      title: "Workdone",
      imageUrl: "https://img.freepik.com/premium-vector/google-sheets-logo_578229-309.jpg",
      completed: workdoneYesCount,
      incomplete: workdoneNoCount,
    },
    {
      id: 4,
      title: "Attendance",
      imageUrl:
        "https://www.iconshock.com/image/RealVista/Education/attendance_list",
      present: presentCount,
      absent: absentCount < 0 ? 0 : absentCount,
      halfDay: halfDayCount,
      tardy: tardyCount,
      totalEmployees: totalEmployeesCount,
    },
  ];

  return (
    <div className="dashboard-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Sidebar />
      <div className="main-content">
        <div className="card-wrapper">
          {cardData.map((card) => (
            <div key={card.id} className="custom-card">
              <img src={card.imageUrl} alt={card.title} className="card-img" />
              <h3 className="card-text">{card.title}</h3>
              {card.id !== 4 ? (
                <>
                  <p><strong>Completed:</strong> {card.completed}</p>
                  <p><strong>Incomplete:</strong> {card.incomplete}</p>
                </>
              ) : (
                <>
                   <p><strong>Present:</strong> {card.present}</p>
    <p><strong>Absent:</strong> {card.absent}</p>
    <p><strong>Tardy:</strong> {card.halfDay}</p>  {/* <-- Added here */}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="table-container" style={{ position: "relative" }}>
          <div style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "linear-gradient(to right, #e0f7fa, #ffffff)",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            fontSize: "18px",
            fontWeight: 600,
            color: "#00796b"
          }}>
            🕒 Employees Timing Report
          </div>

          <div style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "linear-gradient(to right, #ffffff, #f0f0f0)",
            padding: "12px 18px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <label htmlFor="date-picker">Select Date:</label>
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />
          </div>

          <table className="attendance-table" style={{ marginTop: "70px" }}>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Entry Time</th>
                <th>Leaving Time</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceTableData.length > 0 ? (
                attendanceTableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.entryTime}</td>
                    <td>{row.leavingTime}</td>
                    <td>{row.totalHours}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No attendance records found for selected date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
