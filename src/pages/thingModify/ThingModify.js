import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ThingModify.css";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent";
import PlusIcon from "../../components/PlusIcon/PlusIcon";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ThingModify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // `useLocation`에서 받아온 데이터
  const {
    item_id,
    area_no: initialAreaNo,
    room_no: initialRoomNo,
    storage_no: initialStorageNo,
    row_num: initialRowNum,
  } = location.state || {};

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [storage_no, setStorageNo] = useState(initialStorageNo || ""); // 초기값 세팅
  const [area_no, setAreaNo] = useState(initialAreaNo || "");
  const [room_no, setRoomNo] = useState(initialRoomNo || "");
  const [row_num, setRowNum] = useState(initialRowNum || "");
  const [item_quantity, setItemQuantity] = useState("");
  const [item_name, setItemName] = useState("");
  const [item_type, setItemType] = useState("");
  const [item_Expiration_date, setItemExpirationDate] = useState(null);
  const [file, setFile] = useState("");

  const [spaces, setSpaces] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [storages, setStorages] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUploadClick = () => {
    document.getElementById("fileUpload").click();
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(URL.createObjectURL(uploadedFile)); // 로컬 파일 미리보기 설정
    }
  };

  const accessToken = localStorage.getItem("access_token");

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      if (!item_id) {
        alert("수정할 아이템 ID가 없습니다.");
        navigate("/thing");
        return;
      }

      try {
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/item/${item_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const item = response.data;

        setItemQuantity(item.item_quantity);
        setItemName(item.item_name);
        setItemType(item.item_type);

        setItemExpirationDate(
          item.item_Expiration_date ? new Date(item.item_Expiration_date) : null
        );

        // 서버에서 받아온 이미지 URL 설정
        setFile(item.file || "");
      } catch (error) {
        console.error("Error loading item data:", error);
        alert("데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchData();
  }, [item_id]);

  // 공간 데이터 가져오기
  useEffect(() => {
    const fetchSpaces = async () => {
      const storedUserNo = localStorage.getItem("user_no");
      if (!storedUserNo) {
        alert("사용자 번호가 없습니다.");
        return;
      }

      try {
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/${storedUserNo}/spaces`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setSpaces(response.data);
      } catch (error) {
        console.error("Error fetching spaces:", error);
        alert("공간 데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchSpaces();
  }, []);

  // 방 데이터 가져오기
  useEffect(() => {
    if (!area_no) return;
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/room/${area_no}/rooms`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        alert("방 데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchRooms();
  }, [area_no]);

  // 수납장 데이터 가져오기
  useEffect(() => {
    if (!room_no) return;
    const fetchStorages = async () => {
      try {
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/storage/${room_no}/storages`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setStorages(response.data);
      } catch (error) {
        console.error("Error fetching storages:", error);
        alert("수납장 데이터를 불러오는 데 실패했습니다.");
      }
    };

    fetchStorages();
  }, [room_no]);

  // 칸 데이터 필터링
  useEffect(() => {
    const rows = storages
      .filter((storage) => storage.storage_no === Number(storage_no))
      .flatMap((storage) => storage.storage_row || []);
    setFilteredRows(rows);
  }, [storage_no, storages]);

  const handleSave = async () => {
    if (
      !storage_no ||
      !area_no ||
      !room_no ||
      !row_num ||
      !item_name ||
      !item_type ||
      !item_quantity
    ) {
      alert("필수 데이터를 입력해주세요.");
      return;
    }

    const formattedExpirationDate = item_Expiration_date
      ? new Date(item_Expiration_date).toISOString()
      : null;

    const data = {
      storage_no,
      area_no,
      room_no,
      row_num,
      item_name,
      item_type,
      item_quantity,
      item_Expiration_date: formattedExpirationDate,
      file,
    };

    try {
      await axios.put(
        `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/item/${item_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("수정이 완료되었습니다.");
      navigate("/thing");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("데이터 저장에 실패했습니다.");
    }
  };

  return (
    <div className={`thing-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <SidebarComponent isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="storage-add-content">
        <HeaderComponent isOpen={isSidebarOpen} />
        <div className="storage-add-main">
          <h2 className="title">물건 수정</h2>
          <div className="add-container">
            {/* 파일 업로드 영역 */}
            <div className="upload-container" style={{ marginLeft: "200px" }}>
              {file ? (
                <img
                  src={file} // file이 URL일 경우 그대로 사용
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
            {/* 텍스트 입력 및 드롭다운 영역 */}
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
                style={{ marginTop: "20px" }}
              >
                물건 종류<span className="required">*</span>
              </label>
              <select
                id="itemType"
                className="dropdown-select-type"
                value={item_type}
                onChange={(e) => setItemType(e.target.value)}
                style={{ width: "100%" }}
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
                htmlFor="storageLocation"
                className="input-label"
                style={{ marginTop: "20px" }}
              >
                수납 위치<span className="required">*</span>
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
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThingModify;
