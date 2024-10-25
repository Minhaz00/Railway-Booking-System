// src/components/TrainSearch.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./TrainSearch.css";

const TrainSearch = () => {
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [trainInfo, setTrainInfo] = useState([]);

  // Sample station options (replace with your actual data)
  const stations = ['Dhaka', 'Khulna', 'New York'];

  const handleSearch = () => {
    // Mock API call to fetch train information based on fromStation and toStation
    const fetchedTrainInfo = [
      { trainNumber: '123', trainName: 'Express Train', timings: '10:00 AM - 12:00 PM' },
      { trainNumber: '456', trainName: 'Local Train', timings: '1:00 PM - 3:00 PM' }
    ];

    // Simulate fetching data based on selected stations
    if (fromStation && toStation) {
      // Set fetched data (replace this with your API call)
      setTrainInfo(fetchedTrainInfo);
    } else {
      alert('Please select both From and To stations.');
    }
  };

  return (
    <div className="train-search-container">
      <h2>Search Trains</h2>
      <div>
        <label>From:</label>
        <select value={fromStation} onChange={(e) => setFromStation(e.target.value)} required>
          <option value="">Select Station</option>
          {stations.map((station, index) => (
            <option key={index} value={station}>{station}</option>
          ))}
        </select>
      </div>
      <div>
        <label>To:</label>
        <select value={toStation} onChange={(e) => setToStation(e.target.value)} required>
          <option value="">Select Station</option>
          {stations.map((station, index) => (
            <option key={index} value={station}>{station}</option>
          ))}
        </select>
      </div>
      <button onClick={handleSearch}>Search</button>

      {trainInfo.length > 0 && (
        <div className="train-info">
          <h3>Available Trains:</h3>
          <ul>
            {trainInfo.map((train, index) => (
              <li key={index}>
                <Link to={`/train/${train.trainNumber}`}>
                  <strong>{train.trainName}</strong> - {train.trainNumber} ({train.timings})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrainSearch;
