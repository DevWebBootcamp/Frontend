import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from "./pages/signup/SignUp";
import VerificationFailed from "./pages/verificationfailed/VerificationFailed";
import Login from "./pages/login/Login";
import Verify from "./pages/verify/VerifyCode";
import ProfileUpdate from "./pages/profileUpdate/ProfileUpdate";
import StorageAdd from "./pages/storageAdd/StorageAdd";
import AreaAdd from "./pages/areaAdd/AreaAdd";
import RoomAdd from "./pages/roomAdd/RoomAdd";
import Home from "./pages/home/Home";
import "./App.css"; // 스타일 적용

function App() {


  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verification-failed" element={<VerificationFailed />} />
            <Route path="/verify-code" element={<Verify />} />
            <Route path="/profile-update" element={<ProfileUpdate />} />
            <Route path="/storage-add" element={<StorageAdd />} />
            <Route path="/area-add" element={<AreaAdd/>} />
            <Route path="/room-add" element={<RoomAdd/>} />
            <Route path="/home" element={<Home/>} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
