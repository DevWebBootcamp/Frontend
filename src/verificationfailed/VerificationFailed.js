import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VerificationFailed.css';  // 스타일링 적용

function VerificationFailed() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/signup');  // 회원가입 페이지로 이동
  };

  return (
    <div className="container-failed">
      <div className="frame-failed">
        <h2>인증 실패</h2>
        <p>인증 코드가 잘못되었습니다. 다시 시도해주세요.</p>
        <div className="button-container">
          <button className="retry-button" onClick={handleRetry}>다시 시도</button>
        </div>
      </div>
    </div>
  );
}

export default VerificationFailed;
