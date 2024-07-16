import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';


const PreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sheetData, setSheetData] = useState([]);

  const SPREADSHEET_ID = '1svIQ0U9n8eUnkh4Sxxz4X3c9N8WcmaeSXAUYOhsz31Q';
  const RANGE = 'Sheet1!A:G'; // Adjust the range as per your sheet's structure

  useEffect(() => {
    const fetchDataFromSheet = async () => {
      try {
        await gapi.client.init({
          apiKey: 'AIzaSyBuYJnQGPUbW9OrzBeX2AZKuFPfRTwAf_o',
          discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        });

        const response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: RANGE,
        });

        const values = response.result.values;
        console.log('Fetched values:', values); // Log the fetched values

        if (values) {
          const header = values[0];
          console.log('Header:', header); // Log the header

          const data = values.slice(1).map(row => {
            return header.reduce((obj, key, index) => {
              obj[key] = row[index];
              return obj;
            }, {});
          });

          console.log('Mapped data:', data); // Log the mapped data
          setSheetData(data);
        } else {
          console.log('No data found.');
        }
      } catch (error) {
        console.error('Error fetching data from Google Sheet:', error);
      }
    };

    fetchDataFromSheet();
  }, [location.key]); // Fetch data when component mounts or when location key changes

  const handleAddNewRow = () => {
    const newRow = ['Select', '', '', '', '', 'Select', ''];
    setSheetData([...sheetData, newRow]);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };


  return (
    <div>
      <h1>Preview Page</h1>
      <button onClick={handleLogout} style={{ position: 'absolute', right: '10px', top: '10px' }}>Logout</button>
      <button onClick={() => navigate('/dashboard')}>Go Back to Home</button>
      <table style={{ borderCollapse: 'collapse', width: '100%', margin: '40px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Task Engagement level</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Empowering Task Details</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Anticipated Start Date</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Complete By Date</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Actual Start Date</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Status of Progress</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Notes</th>
            <th style={{ border: '1px solid black', padding: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '24px' }} onClick={handleAddNewRow}>
              &#43;
            </th>
          </tr>
        </thead>
        <tbody>
          {sheetData.map((row, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{row['Task Engagement level']}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{row['Empowering Task Details']}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{row['Anticipated Start Date']}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{row['Complete By Date']}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{row['Actual Start Date']}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{row['Status of Progress']}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{row['Notes']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default PreviewPage;
