import "./Header.css";
import React, { useState } from "react";
import axios from "axios";
import logo from "../image/로고.png";
import search from "../image/검색창.png";

function Header() {
  return (
    <div className="screen">
      <div className="header">
        <img src={logo} alt="로고" className="logoStyle"></img>
        <form>
          <input type="text" className="searchbar"></input>
        </form>
      </div>
      <hr className="divide" />
    </div>
  );
}

export default Header;
