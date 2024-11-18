import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ThingAdd.css";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent";
import PlusIcon from "../../components/PlusIcon/PlusIcon";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ThingAdd = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [storage_no, setStorageNo] = useState("");
  const [item_quantity, setItemQuantity] = useState("");
  const [row_num, setRowNum] = useState("");
  const [item_name, setItemName] = useState("");
  const [item_type, setItemType] = useState("");
  const [item_expiration_date, setItemExpirationDate] = useState(null);
  const [file, setFile] = useState(""); // 파일 경로 저장

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUploadClick = () => {
    document.getElementById("fileUpload").click();
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(URL.createObjectURL(uploadedFile)); // 파일 경로 저장
      console.log("Uploaded file:", uploadedFile);
      console.log("File URL:", URL.createObjectURL(uploadedFile));
    }
  };

  const handleSave = async () => {
    if (!storage_no || !item_quantity || !row_num || !item_name || !item_type) {
      alert("필수 데이터를 입력해주세요");
      return;
    }

    const data = {
      storage_no,
      item_quantity,
      row_num,
      item_name,
      item_type,
      item_expiration_date,
      file,
    };

    try {
      const response = await axios.post(
        "https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/item",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("Data successfully sent:", response.data);
      alert("데이터가 성공적으로 저장되었습니다.");
      navigate("/thing");
    } catch (error) {
      console.error("Error posting data:", error);
      alert("데이터 저장에 실패했습니다.");
    }
  };

  return (
    <div className={`thing-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <SidebarComponent isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="storage-add-content">
        <HeaderComponent isOpen={isSidebarOpen} />
        <div className="storage-add-main">
          <h2 className="title">물건수납</h2>
          <div className="add-container">
            <div className="upload-container" style={{ marginLeft: "200px" }}>
              {file ? (
                <img
                  src={file}
                  alt="Uploaded Preview"
                  className="uploaded-image"
                  onClick={handleUploadClick}
                />
              ) : (
                <PlusIcon onClick={handleUploadClick} />
              )}
              <button
                type="button"
                className="upload-button"
                onClick={handleUploadClick}
              >
                사진 업로드
              </button>
              <input
                type="file"
                id="fileUpload"
                className="file-input"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div className="text-box-container">
              <label htmlFor="itemName" className="input-label">
                물건 이름<span className="required">*</span>
              </label>
              <input
                type="text"
                id="itemName"
                className="text-input"
                value={item_name}
                onChange={(e) => setItemName(e.target.value)}
              />
              <label
                htmlFor="itemDescription"
                className="input-label"
                style={{ marginTop: "20px" }}
              >
                상세 설명<span className="required">*</span>
              </label>
              <input
                type="text"
                id="itemDescription"
                className="text-input"
                value={item_type}
                onChange={(e) => setItemType(e.target.value)}
              />
              <label
                htmlFor="itemExpiration"
                className="input-label"
                style={{ marginTop: "20px" }}
              >
                유통기한
              </label>
              <DatePicker
                selected={item_expiration_date}
                onChange={(date) => setItemExpirationDate(date)}
                dateFormat="yyyy-MM-dd"
                className="text-input"
              />
              <label
                htmlFor="itemName"
                className="input-label"
                style={{ marginTop: "20px" }}
              >
                수납 장소<span className="required">*</span>
              </label>
              <div className="dropdown-container">
                <select
                  id="storageLocation"
                  className="dropdown-select"
                  value={storage_no}
                  onChange={(e) => setStorageNo(e.target.value)}
                >
                  <option value="">방이름</option>
                  <option value="1">방 1</option>
                  <option value="2">방 2</option>
                  <option value="3">방 3</option>
                  <option value="4">방 4</option>
                </select>
                <select
                  id="storageCategory"
                  className="dropdown-select"
                  value={item_quantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                >
                  <option value="">수납장</option>
                  <option value="1">수납장 1</option>
                  <option value="2">수납장 2</option>
                  <option value="3">수납장 3</option>
                </select>
                <select
                  id="storageType"
                  className="dropdown-select"
                  value={row_num}
                  onChange={(e) => setRowNum(e.target.value)}
                >
                  <option value="">수납칸</option>
                  <option value="1">1번칸</option>
                  <option value="2">2번칸</option>
                  <option value="3">3번칸</option>
                </select>
              </div>
            </div>
          </div>
          <button className="save-button" onClick={handleSave}>
            수납하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThingAdd;
