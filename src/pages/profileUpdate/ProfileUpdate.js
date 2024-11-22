import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../layout/MainLayout";
import "./profileUpdate.css";
import Modal from 'react-modal';

// 접근성 문제 해결을 위해 Modal.setAppElement 추가
Modal.setAppElement('#root');

const ProfileUpdate = () => {
    const [nickname, setNickname] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [error, setError] = useState(null);
    const [user_no, setUserNo] = useState(null);

    // 사용자 정보 상태 추가
    const [email, setEmail] = useState("");
    const [cellPhone, setCellPhone] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("");

    // 비밀번호 변경 상태
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 프로필 등록 여부 확인 상태
    const [isProfileRegistered, setIsProfileRegistered] = useState(false);

    // 모달 상태
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const API_BASE_URL = "https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app";

    useEffect(() => {
        const storedUserNo = localStorage.getItem('user_no');
        if (storedUserNo) {
            setUserNo(Number(storedUserNo));
            fetchUserProfile(Number(storedUserNo));
            fetchUserProfileImage(Number(storedUserNo));
        }
    }, []);

    const fetchUserProfile = async (user_no) => {
        const accessToken = localStorage.getItem('access_token');
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/profile/${user_no}`,
                {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            const { nickname, email, cell_phone, birthday, gender } = response.data;
            setNickname(nickname);
            setEmail(email);
            setCellPhone(cell_phone);
            setBirthday(birthday);
            setGender(gender);
            setIsProfileRegistered(true);
        } catch (error) {
            console.error("프로필 정보를 가져오는 중 오류 발생:", error);
            setError("사용자 정보를 불러오는 데 실패했습니다.");
            setIsProfileRegistered(false);
        }
    };

    const fetchUserProfileImage = async (user_no) => {
        const accessToken = localStorage.getItem('access_token');
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/profile-image/${user_no}`,
                {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                    responseType: 'blob',
                    withCredentials: true,
                }
            );
            const imageBlob = response.data;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImagePreview(imageUrl);
            setIsProfileRegistered(true);
        } catch (error) {
            if (error.response?.status === 404) {
                setImagePreview("");
            } else {
                console.error("프로필 이미지를 가져오는 중 오류 발생:", error);
                setError("프로필 이미지를 불러오는 데 실패했습니다.");
            }
            setIsProfileRegistered(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!nickname && !imageFile) {
            openModal("닉네임 또는 이미지를 입력해주세요.");
            return;
        }
        const accessToken = localStorage.getItem('access_token');
        const formData = new FormData();
        formData.append("nickname", nickname);
        if (imageFile) formData.append("file", imageFile);

        try {
            const url = isProfileRegistered
                ? `${API_BASE_URL}/users/profile-update/${user_no}`
                : `${API_BASE_URL}/users/profile-create/${user_no}`;
            const method = isProfileRegistered ? "put" : "post";
            await axios[method](url, formData, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                withCredentials: true,
            });
            openModal("프로필이 성공적으로 업데이트되었습니다!");
            setIsProfileRegistered(true);
        } catch (error) {
            console.error("프로필 업데이트 중 오류 발생:", error);
            openModal("프로필 업데이트에 실패했습니다.");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            openModal("비밀번호가 일치하지 않습니다.");
            return;
        }
        const accessToken = localStorage.getItem('access_token');
        try {
            await axios.put(
                `${API_BASE_URL}/users/change-password`,
                { password: newPassword },
                {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            openModal("비밀번호가 성공적으로 변경되었습니다!");
        } catch (error) {
            console.error("비밀번호 변경 중 오류 발생:", error);
            openModal("비밀번호 변경에 실패했습니다.");
        }
    };

    const openModal = (message) => {
        setModalMessage(message);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalMessage("");
    };

    return (
        <Layout>
            <div className="container">
                <div className="profile-frame">
                    <h1 className="profile-title">마이페이지</h1>
                    <div className="user-info-container">
                        <div className="user-info-item">
                            <label className="label">이메일</label>
                            <p className="user-info-value">{email}</p>
                        </div>
                        <div className="user-info-item">
                            <label className="label">전화번호</label>
                            <p className="user-info-value">
                                {cellPhone.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3")}
                            </p>
                        </div>
                        <div className="user-info-item">
                            <label className="label">생일</label>
                            <p className="user-info-value">
                                {birthday
                                    ? `${new Date(birthday).getFullYear()}년 ${(new Date(birthday).getMonth() + 1)
                                          .toString()
                                          .padStart(2, "0")}월 ${new Date(birthday)
                                          .getDate()
                                          .toString()
                                          .padStart(2, "0")}일`
                                    : "생일 정보 없음"}
                            </p>
                        </div>
                        <div className="user-info-item">
                            <label className="label">성별</label>
                            <p className="user-info-value">{gender}</p>
                        </div>
                    </div>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="field-container">
                            <label className="label">닉네임</label>
                            <input
                                className="input-field"
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="닉네임"
                            />
                        </div>
                        <div className="field-container">
                            <label className="label">이미지 업로드</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="custom-file-upload"
                            />
                        </div>
                        {imagePreview && (
                            <div className="profile-image-container">
                                <img
                                    src={imagePreview}
                                    alt="미리보기"
                                    className="profile-image"
                                />
                            </div>
                        )}
                        <div className="button-container">
                            <button
                                className="update-button"
                                type="submit"
                                disabled={!user_no}
                            >
                                프로필 업로드
                            </button>
                        </div>
                    </form>
                    <form onSubmit={handlePasswordChange}>
                        <div className="field-container">
                            <label className="label">새 비밀번호</label>
                            <input
                                className="input-field"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="새 비밀번호"
                                required
                            />
                        </div>
                        <div className="field-container">
                            <label className="label">비밀번호 확인</label>
                            <input
                                className="input-field"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="비밀번호 확인"
                                required
                            />
                        </div>
                        <div className="button-container">
                            <button className="update-button" type="submit">
                                비밀번호 변경
                            </button>
                        </div>
                    </form>
                    {error && <p className="error-text">{error}</p>}
                </div>
            </div>
            <Modal 
                isOpen={modalIsOpen} 
                onRequestClose={closeModal} 
                className="ReactModal__Content" 
                overlayClassName="ReactModal__Overlay"
            >
                <h2>알림</h2>
                <p>{modalMessage}</p>
                <button onClick={closeModal}>확인</button>
            </Modal>
        </Layout>
    );
};

export default ProfileUpdate;
