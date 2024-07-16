import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { gapi } from 'gapi-script';


const DailySatus = () => {

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

  const handleInputChange = (event, rowIndex, cellIndex) => {
    const value = event.target.value;
    const updatedSheetData = sheetData.map((row, idx) => (
      idx === rowIndex ? [...row.slice(0, cellIndex), value, ...row.slice(cellIndex + 1)] : row
    ));
    setSheetData(updatedSheetData);
  };

  const handleAddNewRow = () => {
    const newRow = ['Select', '', '', '', '', 'Select', ''];
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

      const dateTime = new Date().toLocaleString();
      const updatedSheetData = sheetData.map(row => [...row, dateTime]);

      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW',
        resource: {
          values: updatedSheetData,
        },
      });

      console.log(response);
      alert('Sheet updated successfully!');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  const handlePreviewClick = () => {
   // const navigate=useNavigate();
    navigate('/preview');
  };

  return (
    <div className="home-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
      {user && <h2>Welcome, {user.email} at Daily Status Page</h2>}
      <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
      <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
      <table style={{ margin: '10px ', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                  ) : cellIndex === 1 ? (
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
                      <option value="On the Path">Hourly Type-Slack update Checking</option>
                      <option value="Pausing for Potential">Hourly Type - Mail Update Checking</option>
                      <option value="Victory Achieved">Daily Type - Meeting Update Checking</option>
                      <option value="Victory Achieved">Daily Type - jira Update Checking</option>
                      <option value="Victory Achieved">Daily Type - plan for today</option>
                      <option value="Victory Achieved">Daily Type - Task Update</option>
                      <option value="On the Path">Daily Type - Task Update - JIRA Update</option>
                      <option value="Pausing for Potential"> Daily Type - Task Update - Slack Update</option>
                      <option value="Victory Achieved">Daily Type - Daily Time log in jira</option>
                      <option value="Victory Achieved">Daily Type - Plan for Tomorrow</option>
                      <option value="Victory Achieved">Weekly Type - Plan for the week</option>
                      <option value="Victory Achieved">Bi-Weekly - Sprint Planning</option>
                      <option value="On the Path">Bi-Weekly - Story Grooming & estimation</option>
                      <option value="Pausing for Potential">Monthly type - Plan for the Month</option>
                      <option value="Victory Achieved">Monthly type - Monthly Time log</option>
                      <option value="Victory Achieved">Yearly Type</option>
                      <option value="Victory Achieved">Meeting type - Preparation for Meeting</option>
                      <option value="Victory Achieved">Meeting type - Draft&broadcast the outcome of the meeting</option>
                       <option value="On the Path">Requirement Analysis</option>
                      <option value="Pausing for Potential">Issue Analysis</option>
                      <option value="Victory Achieved">Code Analysis</option>
                      <option value="Victory Achieved">Implementation - story</option>
                      <option value="Victory Achieved">Implementation - code test coverage </option>
                      <option value="Victory Achieved">Implementation - code fix</option>
                      <option value="On the Path">Testing - local -Unit testing</option>
                      <option value="Pausing for Potential">Testing - local - Story testing</option>
                      <option value="Victory Achieved">Testing -local - issue testing</option>
                      <option value="Victory Achieved"> Testing QA/UAT -Story testing</option>
                      <option value="Victory Achieved">Testiing QA/UAT - issue testing</option>
                      <option value="Victory Achieved"> Code review -PR Creation </option>
                      <option value="Victory Achieved">Code review -self review  </option>
                       <option value="Victory Achieved">Code review -Peer review  </option>
                       <option value="Victory Achieved"> Deployment -test (QA/UAT/RA) </option>
                       <option value="Victory Achieved">Deployment -Production deployment  </option>
                      <option value="Victory Achieved"> Sprint pre-planning meeting </option>
                       <option value="Victory Achieved"> Sprint Planning Meeting </option>
                       <option value="Victory Achieved"> Sprint internal grooming & estimation meeting </option>
                       <option value="Victory Achieved"> Sprint grooming & estimation meeting </option>
                      <option value="Victory Achieved"> Sprint daily StandUp meeting </option>
                       <option value="Victory Achieved"> Sprint Retro meeting </option>
                    </select>
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
                      <option value="Pending">Pending</option>
                      <option value="InProgress">InProgress</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
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
                  ):cellIndex === 6 ?(
                    <input
                    type="text"
                    value={cell}
                    onChange={(event) => handleInputChange(event, rowIndex, cellIndex)}
                    style={{ width: '100%', padding: '1px' }}
                  />
                  ) : (
                    cell
                  )}
                </td>
              ))}
              <td style={{ border: '1px solid black', padding: '8px', cursor: 'pointer', textAlign: 'center' }} onClick={() => handleDeleteClick(rowIndex)}>
                &#x2716;
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}>Submit Data</button>
      <button onClick={handlePreviewClick} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}>Preview</button>
    </div>
  );
};

export default DailySatus;
