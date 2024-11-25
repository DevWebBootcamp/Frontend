import React, { useState, useEffect, useCallback } from 'react';
import './Home.css';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import SidebarComponent from '../../components/SidebarComponent/SidebarComponent';
import axios from 'axios';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [storages, setStorages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
  const [storageDropdownOpen, setStorageDropdownOpen] = useState(false);
  const [drawerRows, setDrawerRows] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
    setRoomDropdownOpen(false);
    setStorageDropdownOpen(false);
  };

  const handleRoomDropdownClick = () => {
    setRoomDropdownOpen(!roomDropdownOpen);
    setDropdownOpen(false);
    setStorageDropdownOpen(false);
  };

  const handleStorageDropdownClick = () => {
    setStorageDropdownOpen(!storageDropdownOpen);
    setDropdownOpen(false);
    setRoomDropdownOpen(false);
  };

  const handleStorageSelect = useCallback((storage) => {
    setSelectedStorage(storage);
    setStorageDropdownOpen(false);
    localStorage.setItem('selected_storage_no', storage.storage_no);

    setDrawerRows(storage.storage_row);
  }, []);

  const handleRoomSelect = useCallback(
    async (room, savedStorageNo = null) => {
      setSelectedRoom(room);
      setRoomDropdownOpen(false);
      localStorage.setItem('selected_room_no', room.room_no);

      setSelectedStorage(null);
      setStorages([]);
      setDrawerRows(0);

      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/storage/${room.room_no}/storages`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        setStorages(response.data);

        if (savedStorageNo) {
          const storage = response.data.find(
            (s) => s.storage_no === parseInt(savedStorageNo)
          );
          if (storage) handleStorageSelect(storage);
        }
      } catch (error) {
        console.error('수납장 조회 실패: ', error);
        setStorages([]);
      }
    },
    [handleStorageSelect]
  );

  const handleSpaceSelect = useCallback(
    async (space, savedRoomNo = null, savedStorageNo = null) => {
      setSelectedSpace(space);
      setDropdownOpen(false);
      localStorage.setItem('selected_area_no', space.area_no);

      setSelectedRoom(null);
      setSelectedStorage(null);
      setRooms([]);
      setStorages([]);
      setDrawerRows(0);

      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/room/${space.area_no}/rooms`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        setRooms(response.data);

        if (savedRoomNo) {
          const room = response.data.find(
            (r) => r.room_no === parseInt(savedRoomNo)
          );
          if (room) await handleRoomSelect(room, savedStorageNo);
        }
      } catch (error) {
        console.error('방 조회 실패: ', error);
        setRooms([]);
      }
    },
    [handleRoomSelect]
  );

  const handleDrawerClick = async (rowNum) => {
    if (!selectedSpace || !selectedRoom || !selectedStorage) {
      console.error('선택된 공간, 방 또는 수납장이 없습니다.');
      return;
    }

    if (selectedRow === rowNum) {
      setSelectedRow(null);
      setSelectedItems([]);
      return;
    }

    setSelectedRow(rowNum);

    try {
      const userNo = localStorage.getItem('user_no');
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(
        `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/${userNo}/spaces/${selectedSpace.area_no}/rooms/${selectedRoom.room_no}/storages/${selectedStorage.storage_no}/row/${rowNum}/items`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setSelectedItems(response.data);
    } catch (error) {
      console.error('물건 목록 조회 실패: ', error);
      setSelectedItems([]);
    }
  };

  const handleItemClick = (item) => {
    console.log('Item clicked: ', item);
    // 물건 상세 정보로 이동하는 로직을 여기에 추가할 수 있습니다.
  };

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const user_no = localStorage.getItem('user_no');
        if (!user_no) {
          console.error('사용자 ID가 설정되지 않았습니다.');
          return;
        }

        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(
          `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/${user_no}/spaces`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setSpaces(response.data);

        const savedAreaNo = localStorage.getItem('selected_area_no');
        const savedRoomNo = localStorage.getItem('selected_room_no');
        const savedStorageNo = localStorage.getItem('selected_storage_no');

        if (savedAreaNo) {
          const space = response.data.find((s) => s.area_no === parseInt(savedAreaNo));
          if (space) await handleSpaceSelect(space, savedRoomNo, savedStorageNo);
        }
      } catch (error) {
        console.error('공간 조회 실패: ', error);
      }
    };

    fetchSpaces();
  }, [handleSpaceSelect]);


  return (
    <div className={`home-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <SidebarComponent isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="home-content" style={{ backgroundColor: '#ffffff' }}>
        <HeaderComponent isOpen={isSidebarOpen} />
        <div className="dropdown-buttons" style={{ marginBottom: '150px' }}>
          <div className="dropdown">
            <button className="dropdown-button" onClick={handleDropdownClick}>
              {selectedSpace ? selectedSpace.area_name : '공간 선택'}
            </button>
            {dropdownOpen && (
              <ul className="dropdown-list">
                {spaces.length > 0 ? (
                  spaces.map((space, index) => (
                    <li key={index} className="dropdown-item" onClick={() => handleSpaceSelect(space)}>
                      {space.area_name}
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">공간이 없습니다</li>
                )}
              </ul>
            )}
          </div>

          <div className="dropdown">
            <button className="dropdown-button" onClick={handleRoomDropdownClick}>
              {selectedRoom ? selectedRoom.room_name : '방 선택'}
            </button>
            {roomDropdownOpen && (
              <ul className="dropdown-list">
                {rooms.length > 0 ? (
                  rooms.map((room, index) => (
                    <li key={index} className="dropdown-item" onClick={() => handleRoomSelect(room)}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">방이 없습니다</li>
                )}
              </ul>
            )}
          </div>

          <div className="dropdown">
            <button className="dropdown-button" onClick={handleStorageDropdownClick}>
              {selectedStorage ? selectedStorage.storage_name : '수납장 선택'}
            </button>
            {storageDropdownOpen && (
              <ul className="dropdown-list">
                {storages.length > 0 ? (
                  storages.map((storage, index) => (
                    <li key={index} className="dropdown-item" onClick={() => handleStorageSelect(storage)}>
                      {storage.storage_name}
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">수납장이 없습니다</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="home-main">
          <div className="drawer-ui-wrapper">
            <ul className="drawer-wrapper">
              {[...Array(drawerRows)].map((_, index) => (
                <li className="drawer-item" key={index} style={{ '--i': drawerRows - index }}>
                  <button
                    className={`drawer-button ${selectedRow === drawerRows - index ? 'active' : ''}`}
                    onClick={() => handleDrawerClick(drawerRows - index)}
                  >
                    {drawerRows - index}번칸
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {selectedItems.length > 0 ? (
            <div className="item-list">
              <h3>{selectedRow}번칸의 물건 목록</h3>
              <ul>
                {selectedItems.map((item, index) => (
                  <li key={index} onClick={() => handleItemClick(item)} className="clickable-item">
                    {item.item_name}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            selectedRow && (
              <div className="item-list">
                <h3>{selectedRow}번칸의 물건 목록</h3>
                <p>물건이 없습니다</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
