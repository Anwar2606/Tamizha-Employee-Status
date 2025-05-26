import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../Sidebar/Sidebar";


const statusOptions = ["Not Started", "In Progress", "Completed", "On Hold", "Cancelled"];

const WebsiteClients = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const employee = params.get("employee");

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        let q;
        if (employee) {
          const employeeTrimmed = employee.trim();
          q = query(collection(db, "tasks"), where("employeeName", "==", employeeTrimmed));
        } else {
          q = collection(db, "tasks");
        }

        const querySnapshot = await getDocs(q);
        const tasksData = [];
        querySnapshot.forEach((doc) => {
          tasksData.push({ id: doc.id, ...doc.data() });
        });
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
      setLoading(false);
    };

    fetchTasks();
  }, [employee]);

  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistically update the UI
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status: ", error);
      // Optionally, revert the change in UI if update fails
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="clickup-container">
      <div className="clickup-sidebar">
        <Sidebar />
      </div>
      <div className="clickup-main">
        <h2 className="clickup-heading">{employee ? `${employee}'s Tasks` : "All Tasks"}</h2>
        {tasks.length === 0 ? (
          <p>No tasks found for {employee || "all employees"}.</p>
        ) : (
          <table className="clickup-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Employee</th>
                <th>Created At</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
  {tasks.map((task) => (
    <tr
      key={task.id}
      className={task.status === "Completed" ? "completed-task" : ""}
    >
      <td>{task.taskName || task.title || "Untitled"}</td>
      <td>{task.employeeName}</td>
      <td>{formatDate(task.createdAt)}</td>
      <td>{formatDate(task.deadline)}</td>
      <td>
        <select
          className="clickup-dropdown"
          value={task.status || ""}
          onChange={(e) => handleStatusChange(task.id, e.target.value)}
        >
          <option value="" disabled>
            Select status
          </option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default WebsiteClients;
