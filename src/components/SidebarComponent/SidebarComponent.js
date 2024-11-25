import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router 사용
import "./SidebarComponent.css";

const SidebarComponent = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isSidebarClicked, setIsSidebarClicked] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const handleMenuClick = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleSidebarToggle = () => {
    if (isSidebarClicked) {
      setOpenMenuIndex(null);
    }
    setIsSidebarClicked(!isSidebarClicked);
  };

  const handleLogout = () => {
    // 정확한 키 이름으로 각각 삭제
    localStorage.removeItem("access_token");
    localStorage.removeItem("selected_area_no");
    localStorage.removeItem("selected_room_no");
    localStorage.removeItem("selected_storage_no");
    localStorage.removeItem("user_no");

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("selected_area_no");
    sessionStorage.removeItem("selected_room_no");
    sessionStorage.removeItem("selected_storage_no");
    sessionStorage.removeItem("user_no");

    // 삭제 여부 확인
    console.log("localStorage after logout:", localStorage);
    console.log("sessionStorage after logout:", sessionStorage);

    if (
      !localStorage.getItem("access_token") &&
      !localStorage.getItem("selected_area_no") &&
      !localStorage.getItem("selected_room_no") &&
      !localStorage.getItem("selected_storage_no") &&
      !localStorage.getItem("user_no")
    ) {
      alert("로그아웃이 성공적으로 처리되었습니다.");
      navigate("/"); // 로그인 페이지로 이동
    } else {
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
      console.error("삭제 실패 데이터:", {
        access_token: localStorage.getItem("access_token"),
        selected_area_no: localStorage.getItem("selected_area_no"),
        selected_room_no: localStorage.getItem("selected_room_no"),
        selected_storage_no: localStorage.getItem("selected_storage_no"),
        user_no: localStorage.getItem("user_no"),
      });
    }
  };

  return (
    <aside
      className={`side-bar ${isSidebarClicked ? "side-bar-icon-clicked" : ""}`}
    >
      {/* 햄버거 버튼 */}
      <section className="side-bar__icon-box" onClick={handleSidebarToggle}>
        <section className="side-bar__icon-1">
          <div></div>
          <div></div>
          <div></div>
        </section>
      </section>

      {/* 사이드바 메뉴 */}
      <ul>
        {[
          { name: "마이페이지", link: "/profile-update" },
          { name: "공간", link: "/area-add" },
          { name: "방", link: "/room-add" },
          { name: "수납장", link: "/storage-add" },
          { name: "물건", link: "/thing" },
        ].map((menu, index) => (
          <li key={index}>
            <a
              href={menu.link}
              className="menu-text"
              onClick={() => handleMenuClick(index)}
            >
              {menu.name}
            </a>
          </li>
        ))}
      </ul>

      {/* 로그아웃 버튼 */}
      <div className="side-bar__logout-button">
        <button className="Btn" onClick={handleLogout}>
          <div className="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>
          <div className="text">Logout</div>
        </button>
      </div>
    </aside>
  );
};

export default SidebarComponent;
