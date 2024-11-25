import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import Modal from 'react-modal';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    user_name: '',
    cell_phone: '',
    gender: '남성',
    birthday: { year: '', month: '', day: '' }
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigate = useNavigate();

  // 핸드폰 번호 포맷팅 함수
  const formatPhoneNumber = (value) => {
    const cleaned = ('' + value).replace(/\D/g, '');
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  // 하이픈 제거 함수
  const removeHyphens = (value) => {
    return value.replace(/-/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cell_phone') {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: formatPhoneNumber(value)
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      birthday: {
        ...prevFormData.birthday,
        [name]: value
      }
    }));
  };

  const handleGenderChange = (e) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      gender: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 생년월일 포맷팅
      const formattedBirthday = `${formData.birthday.year}-${formData.birthday.month.padStart(2, '0')}-${formData.birthday.day.padStart(2, '0')}`;
      
      // 핸드폰 번호에서 하이픈 제거
      const phoneNumberWithoutHyphens = removeHyphens(formData.cell_phone);
      
      // 전송할 데이터 준비
      const dataToSend = {
        ...formData,
        birthday: formattedBirthday,
        cell_phone: phoneNumberWithoutHyphens
      };
      
      // 데이터 전송
      const response = await axios.post('https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/users/signup', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const userNo = response.data.user_no; // 서버에서 반환한 user_no 가져오기
        const token = response.data.access_token;
        localStorage.setItem("user_no", userNo); // 로컬 스토리지에 저장
        localStorage.setItem("access_token", token);
        openModal('회원가입 성공! 이메일을 확인하여 인증 코드를 입력하세요.');
        navigate('/verify-code');
      }
    } catch (error) {
      openModal('회원가입 실패: ' + (error.response ? error.response.data.detail : error.message));
    }
  };

  const openModal = (message) => {
    setModalMessage(message);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalMessage('');
  };

  return (
    <div className="container-7">
      <div className="frame-13">
        <div className="sign-up">Sign up</div>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="field-container">
            <div className="label">이름</div>
            <input
              type="text"
              name="user_name"
              placeholder="홍길동"
              value={formData.user_name}
              onChange={handleChange}
              className="input-field name-input"
            />
          </div>
          <div className="field-container">
            <div className="label">이메일</div>
            <input
              type="email"
              name="email"
              placeholder="rlfehd@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="field-container">
            <div className="label">전화번호</div>
            <input
              type="text"
              name="cell_phone"
              placeholder="010-1234-5678"
              value={formData.cell_phone}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="field-container">
            <div className="label">비밀번호</div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="field-container">
            <div className="label">성별</div>
            <div className="gender-container">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="남성"
                  checked={formData.gender === '남성'}
                  onChange={handleGenderChange}
                />
                <span>남성</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="여성"
                  checked={formData.gender === '여성'}
                  onChange={handleGenderChange}
                />
                <span>여성</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="기타"
                  checked={formData.gender === '기타'}
                  onChange={handleGenderChange}
                />
                <span>기타</span>
              </label>
            </div>
          </div>
          <div className="field-container">
            <div className="birthday-label">생년월일</div>
            <div className="birthday-container">
              <select
                name="year"
                value={formData.birthday.year}
                onChange={handleDateChange}
                className="input-field"
              >
                <option value="">년</option>
                {[...Array(100).keys()].map(i => (
                  <option key={i} value={2024 - i}>{2024 - i}</option>
                ))}
              </select>
              <select
                name="month"
                value={formData.birthday.month}
                onChange={handleDateChange}
                className="input-field"
              >
                <option value="">월</option>
                {[...Array(12).keys()].map(i => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select
                name="day"
                value={formData.birthday.day}
                onChange={handleDateChange}
                className="input-field"
              >
                <option value="">일</option>
                {[...Array(31).keys()].map(i => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="button-container">
            <button type="button" className="group-9" onClick={() => navigate('/login')}>
              취소
            </button>
            <button type="submit" className="group-10">
              회원가입
            </button>
          </div>
        </form>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="ReactModal__Content" overlayClassName="ReactModal__Overlay">
        <h2>알림</h2>
        <p>{modalMessage}</p>
        <button onClick={closeModal}>확인</button>
      </Modal>
    </div>
  );
}

export default SignUp;
