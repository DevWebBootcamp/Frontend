import React, { useState } from "react";
import "./SidebarComponent.css";

const SidebarComponent = () => {
  // 현재 열려 있는 메뉴 항목의 인덱스를 저장하는 상태
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  // 메뉴 항목 클릭 시 호출되는 함수
  const handleMenuClick = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const [isSidebarClicked, setIsSidebarClicked] = useState(false);

  // 사이드바 햄버거 버튼 클릭 시 호출되는 함수
  const handleSidebarToggle = () => {
    if (isSidebarClicked) {
      // 사이드바가 닫힐 때 서브메뉴도 닫음
      setOpenMenuIndex(null);
    }
    setIsSidebarClicked(!isSidebarClicked);
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
        <button className="Btn">
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
