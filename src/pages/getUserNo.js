import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // 중괄호를 포함한 named import

const UserProfile = () => {
  const [userNo, setUserNo] = useState(null);

  useEffect(() => {
    // localStorage에서 저장된 토큰 가져오기
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // jwt-decode를 이용해 토큰 디코딩
        const decodedToken = jwtDecode(token);

        // 페이로드에서 user_no 추출
        const userNoFromToken = decodedToken.user_no;
        setUserNo(userNoFromToken);
      } catch (error) {
        console.error("토큰 디코딩 중 오류 발생:", error);
      }
    } else {
      console.log("토큰이 없습니다. 로그인해주세요.");
    }
  }, []);

  return (
    <div style={{ width: "1920px" }}>
      {userNo ? (
        <p style={{ color: "white" }}>User No: {userNo}</p>
      ) : (
        <p style={{ color: "white" }}>
          로그인 후 사용자 번호를 확인할 수 있습니다.
        </p>
      )}
    </div>
  );
};

export default UserProfile;
