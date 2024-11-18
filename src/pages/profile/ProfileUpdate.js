import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css"; // CSS 파일 import

const ProfileUpdate = () => {
    const [nickname, setNickname] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [error, setError] = useState(null);
    const [user_no, setUserNo] = useState(null);

    // 사용자 번호 설정
    useEffect(() => {
        const storedUserNo = localStorage.getItem('user_no');
        if (storedUserNo) {
            setUserNo(Number(storedUserNo)); // 사용자 번호 설정
        }
    }, []);

    // 닉네임 입력 핸들러
    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    // 이미지 파일 선택 시 미리보기 업데이트
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // 이미지 미리보기 업데이트
                setImageUrl(file.name); // 파일 이름을 이미지 URL로 설정
            };
            reader.readAsDataURL(file); // 파일을 Data URL로 읽기
        }
    };

    // 폼 제출 핸들러 (프로필 수정)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user_no === null) {
            setError("유효한 사용자 번호가 없습니다.");
            return;
        }

        // 전송할 데이터
        const data = {
            nickname: nickname,
            image_url: imageUrl, // 이미지 URL (파일 이름)
        };

        const accessToken = localStorage.getItem('access_token');

        try {
            // 프로필 수정 API 요청 (PUT)
            const response = await axios.put(
                `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/users/profile-update/${user_no}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}` // 액세스 토큰 포함
                    }
                }
            );

            console.log(response.data);
            alert("프로필이 성공적으로 수정되었습니다!");
        } catch (error) {
            console.error("프로필 수정 중 오류 발생:", error);
            setError("프로필 수정에 실패했습니다.");
        }
    };

    return (
        <div className="container">
            <div className="profile-frame">
                <h1 className="profile-title">프로필 수정</h1>
                <form onSubmit={handleSubmit}>
                    {/* 닉네임 필드 */}
                    <div className="field-container">
                        <label className="label">닉네임</label>
                        <input
                            className="input-field"
                            type="text"
                            value={nickname}
                            onChange={handleNicknameChange}
                            placeholder="닉네임"
                            required
                        />
                    </div>

                    {/* 이미지 업로드 필드 */}
                    <div className="field-container">
                        <label className="label">이미지 업로드</label>
                        <div className="custom-file-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload">파일 선택</label> {/* 라벨 클릭 시 파일 선택 */}
                        </div>
                    </div>
                    {imagePreview && (
                        <div className="image-preview-container">
                            <img src={imagePreview} alt="미리보기" className="image-preview" />
                        </div>
                    )}

                    {/* 수정 버튼 */}
                    <div className="button-container">
                        <button className="update-button" type="submit" disabled={user_no === null}>프로필 수정</button>
                    </div>
                </form>
                {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
};

export default ProfileUpdate;
