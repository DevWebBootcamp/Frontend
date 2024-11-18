import React, { useState } from "react";
import "./ThingDelete.css";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent";
import { useNavigate } from "react-router-dom";

const ThingDelete = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`thing-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <SidebarComponent isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="storage-add-content">
        <HeaderComponent isOpen={isSidebarOpen} />
        <div className="storage-add-main">
          <h2 className="title">물건삭제</h2>
          <div className="button-container">
            <button type="button" className="button-style">
              물건 추가하기
            </button>
            <button type="button" className="button-style">
              물건 수정하기
            </button>
            <button type="button" className="button-style">
              물건 삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThingDelete;
