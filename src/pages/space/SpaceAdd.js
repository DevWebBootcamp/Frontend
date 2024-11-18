import React, { useState } from "react";
import axios from "axios";
import "./SpaceAdd.css";
import Header from "../header/Header";

function Space() {
  const [spaceName, setSpaceName] = useState("");
  const [spaceDescription, setSpaceDescription] = useState("");

  const handlePostRequest = async () => {
    const spaceData = {
      area_name: spaceName,
    };

    try {
      // axios를 이용해 서버에 POST 요청
      const response = await axios.post(
        "https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/storages/{user_no}/spaces",
        spaceData
      );
      console.log("서버 응답:", response.data);
      // 요청이 성공하면 필요한 후속 작업 (예: 성공 메시지 표시)
      alert("공간이 성공적으로 추가되었습니다!");
    } catch (error) {
      console.error("POST 요청 중 오류 발생:", error);
      // 요청 실패 시 오류 처리
      alert("공간 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="screen">
      <Header />
      <div>
        <input
          type="text"
          placeholder="공간 이름을 입력해주세요"
          style={{ border: "1px solid black" }}
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)} // 입력값을 상태로 저장
        />
        <br />
        <input
          type="text"
          placeholder="공간 설명을 입력해주세요"
          value={spaceDescription}
          onChange={(e) => setSpaceDescription(e.target.value)} // 입력값을 상태로 저장
        />
        <br />
        <button type="button" onClick={handlePostRequest}>
          공간 추가
        </button>
      </div>
    </div>
  );
}

export default Space;
