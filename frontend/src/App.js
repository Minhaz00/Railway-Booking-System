// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import "./App.css"; // Import the CSS file
import TrainSearch from "./components/TrainSearch/TrainSearch";
import TrainDetail from "./components/TrainDetail/TrainDetail";
import SeatBooking from "./components/SeatBooking/SeatBooking";
import PaymentPage from "./components/Payment/Payment";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <h1>Railway System</h1>
        <Routes>
          <Route path="/" element={<Login />} />{" "}
          {/* Default route to show Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/train-search" element={<TrainSearch />} />
          <Route path="/train/:trainNumber" element={<TrainDetail />} />
          <Route path="/seat-booking" element={<SeatBooking />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
