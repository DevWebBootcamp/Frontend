import React, { useState, useEffect } from "react";
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
  const [storage_no, setStorageNo] = useState(""); // 선택된 수납장 번호
  const [area_no, setAreaNo] = useState("");
  const [room_no, setRoomNo] = useState("");
  const [item_quantity, setItemQuantity] = useState("");
  const [row_num, setRowNum] = useState(""); // 선택된 칸 번호
  const [item_name, setItemName] = useState("");
  const [item_type, setItemType] = useState("");
  const [item_Expiration_date, setItemExpirationDate] = useState(null);
  const [file, setFile] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [user_no, setUserNo] = useState(null);
  const [spaces, setSpaces] = useState([]); // 공간 데이터 저장
  const [rooms, setRooms] = useState([]); // 방 데이터 저장
  const [storages, setStorages] = useState([]); // 수납장 데이터 저장
  const [storageRows, setStorageRows] = useState([]); // 수납장 칸 번호 데이터 저장
  const [filteredRows, setFilteredRows] = useState([]); // 필터링된 칸 번호 데이터 저장

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUploadClick = () => {
    document.getElementById("fileUpload").click();
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); // File 객체를 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 미리보기 URL 생성
      };
      reader.readAsDataURL(uploadedFile); // 파일을 Data URL로 읽기
    }
  };

  useEffect(() => {
    const fetchSpaces = async () => {
      const storedUserNo = localStorage.getItem("user_no");
      if (!storedUserNo) {
        alert("사용자 번호가 없습니다.");
        return;
      }
      setUserNo(Number(storedUserNo));
      try {
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/${storedUserNo}/spaces`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setSpaces(response.data); // 공간 데이터 설정
      } catch (error) {
        console.error("Error fetching spaces:", error);
        alert("공간 데이터를 가져오는 데 실패했습니다.");
      }
    };
    fetchSpaces();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!area_no) return;
      try {
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/room/${area_no}/rooms`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setRooms(response.data); // 방 데이터 설정
      } catch (error) {
        console.error("Error fetching rooms:", error);
        alert("방 데이터를 가져오는 데 실패했습니다.");
      }
    };
    fetchRooms();
  }, [area_no]);

  useEffect(() => {
    const fetchStorages = async () => {
      if (!room_no) return;
      try {
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/storage/${room_no}/storages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setStorages(response.data); // 수납장 데이터 설정
        const rows = response.data.map((storage) => storage.storage_row).flat();
        console.log("Fetched storage_rows:", rows); // storage_row 데이터 출력
        setStorageRows(rows);
      } catch (error) {
        console.error("Error fetching storages:", error);
        alert("수납장 데이터를 가져오는 데 실패했습니다.");
      }
    };
    fetchStorages();
  }, [room_no]);

  useEffect(() => {
    // 선택된 storage_no에 따라 storage_row 필터링
    const rows = storages
      .filter((storage) => storage.storage_no === Number(storage_no))
      .flatMap((storage) => storage.storage_row || []); // storage_row 값 추출
    setFilteredRows(rows); // 필터링된 칸 데이터 설정
  }, [storage_no, storages]);

  const handleSave = async () => {
    if (
      !storage_no ||
      !item_quantity ||
      !row_num ||
      !item_name ||
      !item_type ||
      !room_no ||
      !area_no
    ) {
      alert("필수 데이터를 입력해주세요");
      return;
    }

    const formattedExpirationDate = item_Expiration_date
      ? item_Expiration_date.toISOString().split("T")[0]
      : "";

    const formData = new FormData();
    formData.append("storage_no", Number(storage_no));
    formData.append("row_num", Number(row_num));
    formData.append("item_quantity", Number(item_quantity));
    formData.append("item_name", item_name);
    formData.append("item_type", item_type);
    formData.append("item_Expiration_date", formattedExpirationDate);
    if (file) {
      formData.append("file", file); // File 데이터를 추가
    }

    try {
      await axios.post(
        "https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/item",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data", // FormData 전송을 위한 Content-Type
          },
        }
      );
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
              {imagePreview ? (
                <img
                  src={imagePreview}
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
                htmlFor="itemType"
                className="input-label"
                style={{ marginTop: "20px", height: "40px" }}
              >
                물건 종류<span className="required">*</span>
              </label>
              <select
                id="itemType"
                className="dropdown-select-type"
                value={item_type}
                onChange={(e) => setItemType(e.target.value)}
              >
                <option value="">물건 종류를 선택하세요</option>
                <option value="식품">식품</option>
                <option value="전자제품">전자제품</option>
                <option value="의류">의류</option>
                <option value="사무용품">사무용품</option>
                <option value="생활용품">생활용품</option>
                <option value="기타">기타</option>
              </select>
              <label
                htmlFor="itemQuantity"
                className="input-label"
                style={{ marginTop: "20px" }}
              >
                물건 갯수<span className="required">*</span>
              </label>
              <input
                type="text"
                id="itemQuantity"
                className="text-input"
                value={item_quantity}
                onChange={(e) => setItemQuantity(e.target.value)}
              />
              <label
                htmlFor="itemExpiration"
                className="input-label"
                style={{ marginTop: "20px" }}
              >
                유통기한
              </label>
              <DatePicker
                selected={item_Expiration_date}
                onChange={(date) => setItemExpirationDate(date)}
                dateFormat="yyyy-MM-dd"
                className="text-input-date"
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
                  id="areaDropdown"
                  className="dropdown-select"
                  value={area_no}
                  onChange={(e) => setAreaNo(e.target.value)}
                >
                  <option value="">공간</option>
                  {spaces.map((space) => (
                    <option key={space.area_no} value={space.area_no}>
                      {space.area_name}
                    </option>
                  ))}
                </select>
                <select
                  id="roomDropdown"
                  className="dropdown-select"
                  value={room_no}
                  onChange={(e) => setRoomNo(e.target.value)}
                >
                  <option value="">방</option>
                  {rooms.map((room) => (
                    <option key={room.room_no} value={room.room_no}>
                      {room.room_name}
                    </option>
                  ))}
                </select>
                <select
                  id="storageDropdown"
                  className="dropdown-select"
                  value={storage_no}
                  onChange={(e) => setStorageNo(e.target.value)}
                >
                  <option value="">수납장</option>
                  {storages.map((storage) => (
                    <option key={storage.storage_no} value={storage.storage_no}>
                      {storage.storage_name}
                    </option>
                  ))}
                </select>
                <select
                  id="rowDropdown"
                  className="dropdown-select"
                  value={row_num}
                  onChange={(e) => setRowNum(e.target.value)}
                >
                  <option value="">칸</option>
                  {filteredRows.map((row, index) => (
                    <option key={index} value={row}>
                      {row}번
                    </option>
                  ))}
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
