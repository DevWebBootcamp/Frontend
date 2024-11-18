import React, { useState, useRef, useEffect } from "react";
import Header from "../header/Header";
import house from "../image/house.png";
import edit from "../image/edit.png";
import "./Main.css"; // CSS 파일 추가
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태
  const [inputValue, setInputValue] = useState("내 공간"); // '내 공간' 입력 값 상태
  const [descriptionValue, setDescriptionValue] = useState("공간 설명"); // '공간 설명' 입력 값 상태
  const [isInputEditable, setIsInputEditable] = useState(false); // '내 공간' 입력 가능 여부 상태
  const [isDescriptionEditable, setIsDescriptionEditable] = useState(false); // '공간 설명' 입력 가능 여부 상태
  const inputRef = useRef(null); // '내 공간' input 엘리먼트 참조
  const descriptionRef = useRef(null); // '공간 설명' input 엘리먼트 참조

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // 사이드바 열기/닫기 토글
  };

  const toggleInputEditable = () => {
    setIsInputEditable(!isInputEditable); // '내 공간' 입력 가능 여부 토글
    inputRef.current.focus(); // 아이콘 클릭 시 '내 공간' input에 포커스
  };

  const toggleDescriptionEditable = () => {
    setIsDescriptionEditable(!isDescriptionEditable); // '공간 설명' 입력 가능 여부 토글
    descriptionRef.current.focus(); // 아이콘 클릭 시 '공간 설명' input에 포커스
  };

  // 입력 값에 맞춰 input 너비 조정
  useEffect(() => {
    if (inputRef.current) {
      // '내 공간' 입력된 텍스트에 맞는 width로 설정
      inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (descriptionRef.current) {
      // '공간 설명' 입력된 텍스트에 맞는 width로 설정
      descriptionRef.current.style.width = `${descriptionRef.current.scrollWidth}px`;
    }
  }, [descriptionValue]);

  const handleThing = () => {
    navigate("/thing");
  };

  return (
    <div className="screen">
      <Header />
      <button onClick={handleThing}>물건 조회</button>
      <div className="main-content">
        <div className="vertical-bar-container">
          <ul>
            <li>거실</li>
            <li>주방</li>
            <li>침실</li>
          </ul>
        </div>
        <div className="content">
          <div className="input-container">
            <div className="input-row">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} // '내 공간' 입력값 변경 핸들러
                className="input-field"
                disabled={!isInputEditable} // '내 공간' 상태에 따라 disabled 속성 변경
              />
              <img
                src={edit}
                className="edit-icon"
                alt="edit icon"
                onClick={toggleInputEditable} // 클릭 시 '내 공간' 입력 가능 여부 토글
              />
            </div>
            <div className="input-row">
              <input
                ref={descriptionRef}
                type="text"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)} // '공간 설명' 입력값 변경 핸들러
                className="input-field2"
                disabled={!isDescriptionEditable} // '공간 설명' 상태에 따라 disabled 속성 변경
              />
              <img
                src={edit}
                className="edit-icon"
                alt="edit icon"
                onClick={toggleDescriptionEditable} // 클릭 시 '공간 설명' 입력 가능 여부 토글
              />
            </div>
          </div>
          <div className="image-container">
            <img
              src={house}
              className="house"
              alt="house"
              style={{ marginBottom: "300px" }}
            />
          </div>
        </div>
        <div
          className={`right-sidebar ${isSidebarOpen ? "open" : ""}`}
          onClick={toggleSidebar}
        >
          <div className="sidebar-content">
            <p>{isSidebarOpen ? "Sidebar Content" : "Click to Expand"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
