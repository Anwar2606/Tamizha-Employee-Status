import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Sidebar from '../Sidebar/Sidebar';

const DMViewClient = () => {
  const [clients, setClients] = useState([]);
  const [postersPosted, setPostersPosted] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchClients = async () => {
    try {
      const clientSnapshot = await getDocs(collection(db, 'dmclients'));
      const clientList = clientSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientList);

      // Initialize postersPosted values from Firestore
      const initialPosted = {};
      clientList.forEach(client => {
        initialPosted[client.id] = client.postersPosted || '';
      });
      setPostersPosted(initialPosted);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const formatDate = timestamp => {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  };

  const handleInputChange = (clientId, value) => {
    setPostersPosted(prev => ({
      ...prev,
      [clientId]: value,
    }));
  };

  const handleSave = async (clientId) => {
    const value = postersPosted[clientId];
    if (value === undefined || value === '') {
      alert("Please enter a number");
      return;
    }

    try {
      setLoading(true);
      const clientRef = doc(db, 'dmclients', clientId);
      await updateDoc(clientRef, {
        postersPosted: Number(value),
      });

      // Update local clients state
      setClients(prevClients =>
        prevClients.map(client =>
          client.id === clientId ? { ...client, postersPosted: Number(value) } : client
        )
      );

      alert('Updated successfully!');
    } catch (error) {
      console.error('Error updating posters posted:', error);
      alert('Failed to update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clickup-container">
      <div className="clickup-sidebar">
        <Sidebar />
      </div>

      <div className="clickup-main">
        <div className="header-with-button">
          <h2 className="clickup-heading">DM Client Details</h2>
        </div>

        {clients.length > 0 ? (
          <table className="clickup-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Poster Start Date</th>
                <th>Poster End Date</th>
                <th>Number of Posters Posted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td>{client.clientName || 'N/A'}</td>
                  <td>{formatDate(client.startPosterDate)}</td>
                  <td>{formatDate(client.endPosterDate)}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="Enter number"
                      value={postersPosted[client.id] || ''}
                      onChange={e => handleInputChange(client.id, e.target.value)}
                      style={{ padding: '5px', width: '100px' }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleSave(client.id)}
                      disabled={loading}
                      style={{ padding: '5px 10px' }}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No client data found.</p>
        )}
      </div>
    </div>
  );
};

export default DMViewClient;
