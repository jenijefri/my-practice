import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sheetData, setSheetData] = useState([]);

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
      const range = 'Sheet1!A1:B10'; 
      const apiKey = 'AIzaSyAcxw7GiNnsI8xDXqlNBWTd8cHwuDWq2kY'; 
  
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
      const response = await axios.get(apiUrl);// give the request 
      const sheetValues = response.data.values;// get response
      setSheetData(sheetValues);// fetch specific data
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
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
        <button onClick={handleLogout} className="logout-button" style={{ backgroundColor: '#4CAF50' }}>
  Logout
</button>
      </div>
    </div>
  );
};

export default Home;
