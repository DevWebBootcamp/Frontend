import React from "react";
import { FaPlus } from "react-icons/fa";
import "./PlusIcon.css"; // CSS 파일 import

const PlusIcon = () => {
  return (
    <div className="plus-icon-container">
      <FaPlus className="plus-icon" />
    </div>
  );
};

export default PlusIcon;
