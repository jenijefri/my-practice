import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sheetData, setSheetData] = useState([]);

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
      // For demonstration, initializing with some sample data
      setSheetData([
        ['Option 1', 'Task A', 'Option A', 'Start Date 1', 'End Date 1', 'In Progress', 'Note A'],
        ['Option 2', 'Task B', 'Option B', 'Start Date 2', 'End Date 2', 'Completed', 'Note B'],
        ['Option 3', 'Task C', 'Option C', 'Start Date 3', 'End Date 3', 'Pending', 'Note C'],
      ]);
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

  const handleInputChange = (rowIndex, cellIndex, value) => {
    const updatedSheetData = sheetData.map((row, index) => {
      if (index === rowIndex) {
        return row.map((cell, idx) => (idx === cellIndex ? value : cell));
      }
      return row;
    });
    setSheetData(updatedSheetData);
  };

  const handleAddNewRow = () => {
    const newRow = ['Select', '', 'Select', 'Select', 'Select', '', ''];
    setSheetData([...sheetData, newRow]);
  };

  const handleSubmit = async () => {
    // Your Google Sheets API integration code goes here
    console.log('Submitting data:', sheetData);
    // Example: Send sheetData to Google Sheets API
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
                  contentEditable={true}
                  suppressContentEditableWarning
                  onBlur={(e) => handleInputChange(rowIndex, cellIndex, e.target.innerText)}
                >
                   {cellIndex === 0 ? (
                    <select
                      value={cell}
                      onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="Select">Select</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                  ) : cellIndex === 2 ? (
                    <select
                      value={cell}
                      onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="Select">Select</option>
                      <option value="Option A">Option A</option>
                      <option value="Option B">Option B</option>
                      <option value="Option C">Option C</option>
                    </select>
                  ) : cellIndex === 3 ? (
                    <select
                      value={cell}
                      onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="Select">Select</option>
                      <option value="Start Date 1">Start Date 1</option>
                      <option value="Start Date 2">Start Date 2</option>
                      <option value="Start Date 3">Start Date 3</option>
                    </select>
                    ) : cellIndex === 4 ? (
                      <select
                        value={cell}
                        onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                      >
                        <option value="Select">Select</option>
                        <option value="Start Date 1">Start Date 1</option>
                        <option value="Start Date 2">Start Date 2</option>
                        <option value="Start Date 3">Start Date 3</option>
                      </select>
                  ) : cellIndex === 5 ? (
                    <select
                      value={cell}
                      onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="Select">Select</option>
                      <option value="End Date 1">End Date 1</option>
                      <option value="End Date 2">End Date 2</option>
                      <option value="End Date 3">End Date 3</option>
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
