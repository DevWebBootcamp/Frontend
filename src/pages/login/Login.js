import logo from "../image/로고.png";
import naver from "../image/naver.png";
import kakao from "../image/kakao.png";
import google from "../image/google.png";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate import
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogin = async () => {
    try {
      const userData = new URLSearchParams();
      userData.append("grant_type", "password");
      userData.append("username", username);
      userData.append("password", password);
      userData.append("scope", "your_scope"); // 필요에 따라 조정
      userData.append("client_id", process.env.REACT_APP_CLIENT_ID); // 환경 변수 사용
      userData.append("client_secret", process.env.REACT_APP_CLIENT_SECRET); // 환경 변수 사용

      axios.defaults.withCredentials = true;
      const response = await axios.post(
        "https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/users/login", // API 엔드포인트
        userData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // 요청 헤더 설정
          },
        }
      );

      console.log(response.data); // 응답 데이터 확인

      if (response.status === 200) {
        const token = response.data.access_token; // 서버에서 반환한 토큰을 사용
        const userNo = response.data.user_no; // 서버에서 반환한 user_no
        localStorage.setItem("access_token", token); // 로컬 스토리지에 토큰 저장
        localStorage.setItem("user_no", userNo); // user_no도 로컬 스토리지에 저장
        alert("로그인 성공!");
        navigate("/home"); // 메인 페이지로 이동
      } else {
        alert("로그인 실패");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("에러가 발생하여 로그인에 실패했습니다.");
    }
  };

  return (
    <div className="App">
      <div className="login">
        <div className="logo">
          <img src={logo} alt="로고" />
          <div className="id">
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <label className="stay">
            <input
              id="keep"
              type="checkbox"
              style={{ width: "15px", height: "15px" }}
            />
            <span style={{ color: "black" }}>로그인 유지</span>
          </label>
          <button type="button" className="loginButton" onClick={handleLogin}>
            로그인
          </button>
        </div>
        <div className="registerFind">
          <a href="/signup" style={{ float: "left", marginLeft: "10px" }}>
            회원가입
          </a>
          <a
            href="/users/verify-code"
            style={{ float: "right", marginRight: "10px" }}
          >
            아이디 / 비밀번호 찾기
          </a>
        </div>
        <hr style={{ marginTop: "50px", width: "370px" }} />
        <div
          style={{
            width: "350px",
            margin: "auto",
            display: "flex",
            gap: "70px",
            paddingTop: "20px",
          }}
        >
          <img
            src={naver}
            alt="네이버"
            className="socialLogin"
            onClick={() => {
              console.log(0);
            }}
          />
          <img
            src={kakao}
            alt="카카오"
            className="socialLogin"
            onClick={() => {
              console.log(1);
            }}
          />
          <img
            src={google}
            alt="구글"
            className="socialLogin"
            onClick={() => {
              console.log(2);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;