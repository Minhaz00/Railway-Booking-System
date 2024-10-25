// src/components/TrainDetail.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TrainDetail.css";
import { Link } from "react-router-dom"; // Add this import at the top

const TrainDetail = () => {
  const { trainNumber } = useParams();
  const navigate = useNavigate();
  // Sample seat data for compartments (1-10)
  const [seatData, setSeatData] = useState([]);

  useEffect(() => {
    // Fetch train details and seat data based on trainNumber
    // For now, let's mock some seat data
    const mockSeatData = [
      { compartment: 1, seats: [1, 1, 0, 1, 0, 1, 1, 0, 1, 0] },
      { compartment: 2, seats: [1, 0, 0, 1, 1, 0, 0, 0, 1, 0] },
      { compartment: 3, seats: [0, 1, 0, 1, 0, 1, 1, 1, 0, 1] },
      // More compartments...
    ];

    // Simulate API call
    setSeatData(mockSeatData);
  }, [trainNumber]);

  const handleSeatClick = (compartment, seatIndex) => {
    const isOccupied = seatData[compartment - 1].seats[seatIndex];
    if (isOccupied) {
      alert(`Seat ${seatIndex + 1} in compartment ${compartment} is occupied.`);
    } else {
      alert(
        `Seat ${seatIndex + 1} in compartment ${compartment} is available.`
      );
      navigate("/seat-booking", { state: { compartment, seatIndex } });
    }
  };

  return (
    <div className="train-detail-container">
      <h2>Train Details for Train Number: {trainNumber}</h2>
      <h3>Available Seats:</h3>
      {seatData.map(({ compartment, seats }) => (
        <div key={compartment} className="compartment">
          <h4>Compartment {compartment}</h4>
          <div className="seats">
            {seats.map((isOccupied, index) => (
              <div
                key={index}
                className={`seat ${isOccupied ? "occupied" : "available"}`}
                onClick={() => handleSeatClick(compartment, index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainDetail;
