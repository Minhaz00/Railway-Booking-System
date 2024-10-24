import React, { useState } from 'react';

const TrainBooking = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `/api/trains?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch trains');
      }
      
      const data = await response.json();
      setTrains(data);
    } catch (err) {
      setError('Failed to fetch train information. Please try again.');
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Search Form */}
      <div className="search-card">
        <h2 className="card-title">Search Trains</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="source">From</label>
              <input
                id="source"
                type="text"
                placeholder="Enter source station"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="destination">To</label>
              <input
                id="destination"
                type="text"
                placeholder="Enter destination station"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Trains'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Results */}
      {trains.length > 0 && (
        <div className="results-card">
          <h2 className="card-title">Available Trains</h2>
          <div className="trains-list">
            {trains.map((train) => (
              <div key={train.id} className="train-card">
                <div className="train-details">
                  <div className="detail-group">
                    <span className="detail-label">Train Number</span>
                    <span className="detail-value">{train.trainNumber}</span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Departure</span>
                    <span className="detail-value">{train.departureTime}</span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Arrival</span>
                    <span className="detail-value">{train.arrivalTime}</span>
                  </div>
                  <div className="detail-group">
                    <span className="detail-label">Price</span>
                    <span className="detail-value">₹{train.price}</span>
                  </div>
                </div>
                <button className="book-button">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .search-card, .results-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 24px;
          color: #333;
          margin: 0 0 20px 0;
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          color: #555;
          font-weight: 500;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .input-field:focus {
          outline: none;
          border-color: #2563eb;
        }

        .search-button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .search-button:hover {
          background: #1d4ed8;
        }

        .search-button:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .trains-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .train-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          transition: background-color 0.2s;
        }

        .train-card:hover {
          background: #f8fafc;
        }

        .train-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .train-details {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .detail-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 12px;
          color: #666;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .book-button {
          background: #22c55e;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .book-button:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  );
};

export default TrainBooking;