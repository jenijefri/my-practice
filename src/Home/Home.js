import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [newRow, setNewRow] = useState(['', '']); // State to manage form input

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const loginTime = localStorage.getItem('loginTime');
    const currentTime = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (!storedUser || (currentTime - loginTime > tenMinutes)) {
      navigate('/login');
    } else {
      setUser(storedUser);
      fetchDataFromGoogleSheet(); // Call function to fetch data
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  const fetchDataFromGoogleSheet = async () => {
    try {
      const spreadsheetId = '1nbifmC4-hynJ2Lz0qXAUfhey6nXOGH_HT9SgVOU0bQE'; 
      const range = 'Sheet1!A1:I20'; 
      const apiKey = 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o'; // Replace with your actual API key

      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
      const response = await axios.get(apiUrl);
      const sheetValues = response.data.values;
      setSheetData(sheetValues);
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
    }
  };

  const handleInputChange = (index, event) => {
    const updatedRow = [...newRow];
    updatedRow[index] = event.target.value;
    setNewRow(updatedRow);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const spreadsheetId = '1nbifmC4-hynJ2Lz0qXAUfhey6nXOGH_HT9SgVOU0bQE'; 
      const range = 'Sheet1!A1:B1'; // Example range to append data
      const apiKey = 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o'; // Replace with your actual API key
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
  
      const values = {
        range: range,
        majorDimension: 'ROWS',
        values: [newRow]
      };
  console.log("value");
  console.log(values)
      // Make POST request to Google Sheets API
      const response = await axios.post(apiUrl, values);
      
      console.log("response")
      console.log(response);
      console.log('Update successful', response.data);
      setNewRow(['', '']); // Clear form inputs after successful submission
      fetchDataFromGoogleSheet(); // Fetch updated data after submission
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized - check authentication credentials');
      } else if (error.response && error.response.status === 400) {
        console.error('Bad request - verify request parameters');
      } else {
        console.error('Error updating Google Sheets:', error.message);
      }
    }
  };
  
  return (
    <div className="home-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center' }}>Welcome {user ? user.email : ''} to the Home Page</h2>
      <div className="sheet-data-container" style={{ width: '80%', overflowX: 'auto' }}>
        <h2 style={{ textAlign: 'center' }}>Google Sheet Data:</h2>
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {sheetData[0]?.map((header, index) => (
                <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheetData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <br/>
        <form onSubmit={handleFormSubmit} style={{ margin: '20px 0', textAlign: 'center' }}>
  <h3 style={{ marginBottom: '20px' }}>Enter New Data</h3>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {sheetData[0]?.map((header, index) => (
      <div key={index} style={{ marginBottom: '10px', width: '80%', maxWidth: '400px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>{header}:</label>
        <input
          type="text"
          value={newRow[index] || ''}
          onChange={(e) => handleInputChange(index, e)}
          style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
        />
      </div>
    ))}
    <button type="submit" style={{ margin: '20px 0', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
      Submit
    </button>
  </div>
</form>

        <br/>
        <button onClick={handleLogout} className="logout-button" style={{ backgroundColor: '#4CAF50' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
