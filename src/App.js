import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/signup/SignUp";
import VerificationFailed from "./pages/verificationfailed/VerificationFailed";
import Login from "./pages/login/Login";
import Verify from "./pages/verify/VerifyCode";
import Main from "./pages/main/Main";
import ProfileUpdate from "./pages/profileUpdate/ProfileUpdate";
import StorageAdd from "./pages/storageAdd/StorageAdd";
import AreaAdd from "./pages/areaAdd/AreaAdd";
import RoomAdd from "./pages/roomAdd/RoomAdd";
import Home from "./pages/home/Home";
import Thing from "./pages/thing/Thing";
import ThingAdd from "./pages/thingAdd/ThingAdd";
import ThingModify from "./pages/thingModify/ThingModify";
import ThingDelete from "./pages/thingDelete/ThingDelete";
import "./App.css"; // 스타일 적용

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/verification-failed"
              element={<VerificationFailed />}
            />
            <Route path="/main" element={<Main />} />
            <Route path="/verify-code" element={<Verify />} />
            <Route path="/profile-update" element={<ProfileUpdate />} />
            <Route path="/storage-add" element={<StorageAdd />} />
            <Route path="/area-add" element={<AreaAdd />} />
            <Route path="/room-add" element={<RoomAdd />} />
            <Route path="/home" element={<Home />} />
            <Route path="/thing" element={<Thing />} />
            <Route path="/thing-add" element={<ThingAdd />} />
            <Route path="/thing-modify" element={<ThingModify />} />
            <Route path="/thing-delete" element={<ThingDelete />} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
