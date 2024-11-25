import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Thing.css";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Thing = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState([]); // 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [itemDetails, setItemDetails] = useState(null); // 특정 아이템 세부 정보 저장
  const [userNo, setUserNo] = useState(null); // 사용자 번호

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddThing = () => {
    navigate("/thing-add");
  };

  const handleItemClick = async (item) => {
    setSelectedItem(item); // 선택된 아이템 설정
    await fetchItemDetails(item.item_id); // 아이템 세부 정보 가져오기
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setSelectedItem(null); // 선택된 아이템 초기화
    setItemDetails(null); // 세부 정보 초기화
  };

  const handleEdit = () => {
    if (!selectedItem || !selectedItem.item_id) {
      alert("수정할 아이템이 선택되지 않았습니다.");
      return;
    }

    // `/thing-modify`로 선택된 아이템 정보를 전달하며 이동
    navigate(`/thing-modify`, {
      state: {
        item_id: selectedItem.item_id,
        area_no: selectedItem.area_no,
        room_no: selectedItem.room_no,
        storage_no: selectedItem.storage_no,
        row_num: selectedItem.row_num,
      },
    });
  };

  const handleDelete = async () => {
    if (!selectedItem || !selectedItem.item_id) {
      alert("삭제할 아이템이 선택되지 않았습니다.");
      return;
    }

    const confirmDelete = window.confirm(
      `${selectedItem.item_name}을(를) 정말 삭제하시겠습니까?`
    );

    if (!confirmDelete) return;

    const accessToken = localStorage.getItem("access_token");

    try {
      await axios.delete(
        `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/item/${selectedItem.item_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("아이템이 성공적으로 삭제되었습니다.");
      setItems((prevItems) =>
        prevItems.filter((item) => item.item_id !== selectedItem.item_id)
      );
      closeModal(); // 모달 닫기
    } catch (error) {
      console.error("아이템 삭제 중 오류 발생:", error);
      alert("아이템 삭제에 실패했습니다.");
    }
  };

  // user_no 가져오기 및 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserNo = localStorage.getItem("user_no");
        const accessToken = localStorage.getItem("access_token"); // access token 가져오기

        if (!storedUserNo) {
          setError("사용자 번호가 설정되지 않았습니다.");
          setLoading(false);
          return;
        }
        setUserNo(storedUserNo);

        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/${storedUserNo}/items`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // 인증 토큰 추가
            },
            withCredentials: true, // 쿠키 포함
          }
        );

        setItems(
          Array.isArray(response.data) ? response.data : [response.data]
        );
        setLoading(false);
      } catch (err) {
        console.error("데이터 요청 중 오류 발생:", err);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 특정 아이템 세부 정보 가져오기
  const fetchItemDetails = async (item_id) => {
    try {
      const accessToken = localStorage.getItem("access_token"); // 인증 토큰 가져오기
      const response = await axios.get(
        `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/item/${item_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("아이템 세부 정보:", response.data); // 전체 데이터 확인
      setItemDetails(response.data); // 세부 정보 저장
    } catch (error) {
      console.error("아이템 세부 정보 가져오기 실패:", error);
      setItemDetails(null);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

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
          </div>
          <div>
            <ul className="item-name-list" style={{ margin: "0" }}>
              {items.map((item, index) => (
                <li
                  key={index}
                  className="item-name"
                  onClick={() => handleItemClick(item)}
                >
                  {item.item_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {isModalOpen && selectedItem && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-item-name">{selectedItem.item_name}</h3>
                <FaEdit
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                  className="edit-icon"
                  onClick={handleEdit}
                />
                <FaTrash
                  style={{ fontSize: "24px", cursor: "pointer" }}
                  className="delete-icon"
                  onClick={handleDelete}
                />
              </div>
              <span className="close-button" onClick={closeModal}>
                &times;
              </span>
              <p>공간: {selectedItem.area_name}</p>
              <p>방: {selectedItem.room_name}</p>
              <p>가구: {selectedItem.storage_name}</p>
              <p>수납칸: {selectedItem.row_num}</p>
              {itemDetails?.item_Expiration_date ? (
                <p>유통기한: {itemDetails.item_Expiration_date}</p>
              ) : (
                <p>유통기한: 없음</p>
              )}
              {itemDetails?.item_imageURL && (
                <img
                  src={itemDetails.item_imageURL}
                  alt={`${selectedItem.item_name} 사진`}
                  className="modal-image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    marginTop: "20px",
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Thing;
