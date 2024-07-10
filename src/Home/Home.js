import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [newRow, setNewRow] = useState(['', '', '', '', '', '', '']);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (!storedUser || currentTime - loginTime > tenMinutes) {
      navigate('/login');
    } else {
      setUser(storedUser);
     // fetchDataFromGoogleSheet();
    }
  }, [navigate]);

  //const fetchDataFromGoogleSheet = () => {
    // Simulated data fetching
    //const mockData = [
     // ['Task 1', 'Details 1', '2024-07-10', '2024-07-15', '2024-07-10', 'In Progress', 'Some notes'],
     // ['Task 2', 'Details 2', '2024-07-12', '2024-07-18', '2024-07-12', 'Completed', 'Notes here'],
   // ];
   // setSheetData(mockData);
  //};

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  const handleEditClick = (rowIndex) => {
    setEditingRowIndex(rowIndex);
    setNewRow([...sheetData[rowIndex]]);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const updatedSheetData = [...sheetData];
    if (editingRowIndex !== null) {
      updatedSheetData[editingRowIndex] = [...newRow];
    } else {
      updatedSheetData.push([...newRow]);
    }
    setSheetData(updatedSheetData);
    setNewRow(['', '', '', '', '', '', '']);
    setEditingRowIndex(null);
    setIsEditing(false);
    setIsAddingNew(false);
  };

  const handleDeleteClick = (rowIndex) => {
    const updatedSheetData = sheetData.filter((_, index) => index !== rowIndex);
    setSheetData(updatedSheetData);
    setNewRow(['', '', '', '', '', '', '']);
    setEditingRowIndex(null);
    setIsEditing(false);
  };

  const handleInputChange = (index, value) => {
    const updatedRow = [...newRow];
    updatedRow[index] = value;
    setNewRow(updatedRow);
  };

  const handleAddNewRow = () => {
    setNewRow(['', '', '', '', '', '', '']);
    setIsEditing(true);
    setIsAddingNew(true);
  };

  const handleSubmit = async () => {
    const CLIENT_ID = '482753064087-45cao68n6ucmd3757s0tesp9b34qqlf3.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o';
    const SPREADSHEET_ID = '1svIQ0U9n8eUnkh4Sxxz4X3c9N8WcmaeSXAUYOhsz31Q';
    const RANGE = 'Sheet1!A1';

    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

    function gapiInit() {
      return new Promise((resolve, reject) => {
        gapi.load('client:auth2', () => {
          gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          }).then(() => {
            resolve();
          }, error => {
            reject(error);
          });
        });
      });
    }

    function updateSheet() {
      return gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW',
        resource: {
          values: sheetData,
        },
      });
    }

    try {
      await gapiInit();
      await gapi.auth2.getAuthInstance().signIn();
      await updateSheet();
      alert('Sheet updated successfully!');
    } catch (error) {
      console.error('Error updating sheet', error);
    }
  };

  return (
    <div className="home-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      {user && <h2>Welcome, {user.email}</h2>}
      <table style={{ margin: '20px 0', width: '100%', maxWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Task Engagement level</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Empowering Task Details</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Anticipated Start Date</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Complete By Date</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actual Start Date</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Status of Progress</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Notes</th>
            <th style={{ border: '1px solid black', padding: '8px', cursor: 'pointer', textAlign: 'center', margin: '10px', fontSize: '24px' }} onClick={handleAddNewRow}>
              Actions &#43;
            </th>
          </tr>
        </thead>
        <tbody>
          {sheetData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {rowIndex === editingRowIndex ? (
                <>
                  {newRow.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleInputChange(cellIndex, e.target.value)}
                        style={{ padding: '8px', boxSizing: 'border-box', width: '100%' }}
                      />
                    </td>
                  ))}
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <button onClick={handleSaveClick}>Save</button>
                    <span
                      onClick={() => handleDeleteClick(rowIndex)}
                      style={{ cursor: 'pointer', marginLeft: '5px' }}
                    >
                      &#10006;
                    </span>
                  </td>
                </>
              ) : (
                <>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>{cell}</td>
                  ))}
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <button onClick={() => handleEditClick(rowIndex)}>Edit</button>
                    <span
                      onClick={() => handleDeleteClick(rowIndex)}
                      style={{ cursor: 'pointer', marginLeft: '5px' }}
                    >
                      &#10006;
                    </span>
                  </td>
                </>
              )}
            </tr>
          ))}
          {isEditing && isAddingNew && (
            <tr>
              {newRow.map((cell, index) => (
                <td key={index} style={{ border: '1px solid black', padding: '8px' }}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{ padding: '8px', boxSizing: 'border-box', width: '100%' }}
                  />
                </td>
              ))}
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={handleSaveClick}>Save</button>
                <span
                  onClick={() => setIsEditing(false)}
                  style={{ cursor: 'pointer', marginLeft: '5px' }}
                >
                  &#10006;
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleSubmit} style={{ margin: '20px 0', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        Submit
      </button>
      <button onClick={handleLogout} className="logout-button" style={{ margin: '20px 0', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default Home;
