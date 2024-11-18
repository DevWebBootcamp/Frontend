import React, { useState } from "react";
import "./Thing.css";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent";
import { useNavigate } from "react-router-dom";

const Thing = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddThing = () => {
    navigate("/thing-add");
  };

  const handleModifyThing = () => {
    navigate("/thing-modify");
  };

  const handleDeleteThing = () => {
    navigate("/thing-delete");
  };

  return (
    <div className={`thing-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <SidebarComponent isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="storage-add-content">
        <HeaderComponent isOpen={isSidebarOpen} />
        <div className="storage-add-main">
          <h2 className="title">물건조회</h2>
          <div className="button-container">
            <button
              type="button"
              className="button-style"
              onClick={handleAddThing}
            >
              물건 추가하기
            </button>
            <button
              type="button"
              className="button-style"
              onClick={handleModifyThing}
            >
              물건 수정하기
            </button>
            <button
              type="button"
              className="button-style"
              onClick={handleDeleteThing}
            >
              물건 삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thing;
