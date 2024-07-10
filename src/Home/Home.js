import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { gapi } from 'gapi-script';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sheetData, setSheetData] = useState([]);

  const CLIENT_ID = '482753064087-45cao68n6ucmd3757s0tesp9b34qqlf3.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o';
  const SPREADSHEET_ID = '1svIQ0U9n8eUnkh4Sxxz4X3c9N8WcmaeSXAUYOhsz31Q';
  const RANGE = 'Sheet1!A1';

  const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
  const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (!storedUser || currentTime - loginTime > tenMinutes) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  const handleDeleteClick = (rowIndex) => {
    const updatedSheetData = sheetData.filter((_, index) => index !== rowIndex);
    setSheetData(updatedSheetData);
  };

  const handleAddNewRow = () => {
    const newRow = ['Select', '', null, null, null, 'Select', ''];
    setSheetData([...sheetData, newRow]);
  };

  const gapiInit = () => {
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
  };

  const handleSubmit = async () => {
    try {
      await gapiInit();
      if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await gapi.auth2.getAuthInstance().signIn();
      }

      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW',
        resource: {
          values: sheetData,
        },
      });

      console.log(response);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="home-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      {user && <h2>Welcome, {user.email}</h2>}
      <table style={{ margin: '20px 0', borderCollapse: 'collapse', textAlign: 'left' }}>
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
              &#43;
            </th>
          </tr>
        </thead>
        <tbody>
          {sheetData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{ border: '1px solid black', padding: '8px', cursor: 'pointer' }}
                  contentEditable={cellIndex !== 2 && cellIndex !== 3 && cellIndex !== 4}
                  suppressContentEditableWarning
                >
                  {cellIndex === 0 ? (
                    <select
                      value={cell}
                      onChange={(e) => {
                        const value = e.target.value;
                        const updatedSheetData = sheetData.map((row, idx) => (
                          idx === rowIndex ? [value, ...row.slice(1)] : row
                        ));
                        setSheetData(updatedSheetData);
                      }}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="Select">Select</option>
                      <option value="Primary Owner">Primary Owner</option>
                      <option value="Supporting Role">Supporting Role</option>
                      <option value="Observer">Observer</option>
                    </select>
                  ) : cellIndex === 2 || cellIndex === 3 || cellIndex === 4 ? (
                    <DatePicker
                      selected={cell ? new Date(cell) : null}
                      onChange={(date) => {
                        const updatedSheetData = sheetData.map((row, idx) => (
                          idx === rowIndex ? [...row.slice(0, cellIndex), date, ...row.slice(cellIndex + 1)] : row
                        ));
                        setSheetData(updatedSheetData);
                      }}
                      dateFormat="MM/dd/yyyy"
                      style={{ width: '100%', padding: '8px' }}
                    />
                  ) : cellIndex === 5 ? (
                    <select
                      value={cell}
                      onChange={(e) => {
                        const value = e.target.value;
                        const updatedSheetData = sheetData.map((row, idx) => (
                          idx === rowIndex ? [...row.slice(0, cellIndex), value, ...row.slice(cellIndex + 1)] : row
                        ));
                        setSheetData(updatedSheetData);
                      }}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="Select">Select</option>
                      <option value="On the Path">On the Path</option>
                      <option value="Pausing for Potential">Pausing for Potential</option>
                      <option value="Victory Achieved">Victory Achieved</option>
                    </select>
                  ) : (
                    cell
                  )}
                </td>
              ))}
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <span
                  onClick={() => handleDeleteClick(rowIndex)}
                  style={{ cursor: 'pointer', marginLeft: '5px' }}
                >
                  &#10006;
                </span>
              </td>
            </tr>
          ))}
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
