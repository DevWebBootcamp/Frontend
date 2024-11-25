import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderComponent.css';
import sunabLogo from '../../pages/image/sunab.png';

function HeaderComponent({ isOpen }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [suggestions, setSuggestions] = useState([]); // 자동완성 결과 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

  const handleLogoClick = () => {
    navigate('/home');
  };

  // API 요청 함수
  const fetchSuggestions = async (itemName) => {
    if (!itemName.trim()) {
      setSuggestions([]); // 입력값 없을 때 빈 배열 설정
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/autocomplete?item_name=${encodeURIComponent(
          itemName
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data); // 자동완성 데이터 업데이트
      } else {
        setSuggestions([]); // 결과 없으면 빈 배열 설정
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value); // 입력값이 변경될 때마다 검색 요청
  };

  return (
    <div className={`header-container ${isOpen ? 'sidebar-open' : ''}`}>
      <img
        src={sunabLogo}
        alt="Logo"
        className="header-logo"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
      <div className="input-container">
        <input
          type="text"
          name="text"
          className="input"
          placeholder="찾는 물건 이름을 입력하세요"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <span className="icon">
          <svg
            width="19px"
            height="19px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 5H20"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 8H17"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 22L20 20"
              stroke="#000"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {loading && <div className="loading-spinner">Loading...</div>}
      </div>
      {suggestions.length > 0 && (
        <ul className="autocomplete-dropdown">
          {suggestions.map((item, index) => (
            <li key={index} className="autocomplete-item">
              {`${item.area_name} -> ${item.room_name} -> ${item.storage_name} -> ${item.row_num}번칸 -> ${item.item_name}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HeaderComponent;
