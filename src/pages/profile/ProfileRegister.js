import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css"; // CSS 파일 import

const ProfileRegister = () => {
    const [nickname, setNickname] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [error, setError] = useState(null);
    const [user_no, setUserNo] = useState(null);

    useEffect(() => {
        const storedUserNo = localStorage.getItem('user_no');
        if (storedUserNo) {
            setUserNo(Number(storedUserNo)); // 문자열을 숫자로 변환
        }
    }, []);

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // 이미지 미리보기 업데이트
                setImageUrl(file.name); // 이미지 URL 대신 파일 이름을 사용
            };
            reader.readAsDataURL(file); // 파일을 Data URL로 읽기
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user_no === null) {
            setError("유효한 사용자 번호가 없습니다.");
            return;
        }

        const data = {
            nickname: nickname,
            image_url: imageUrl,
        };

        const accessToken = localStorage.getItem('access_token');

        try {
            const response = await axios.post(
                `https://port-0-teamproject-2024-2-am952nlt496sho.sel5.cloudtype.app/users/profile-create/${user_no}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}` // 액세스 토큰을 포함합니다.
                    }
                }
            );

            console.log(response.data);
            alert("프로필이 성공적으로 등록되었습니다!");
            setNickname("");
            setImageUrl("");
            setImagePreview(""); // 등록 후 미리보기 초기화
        } catch (error) {
            console.error("프로필 등록 중 오류 발생:", error);
            setError("프로필 등록에 실패했습니다.");
        }
    };

    return (
        <div className="container">
            <div className="profile-frame">
                <h1 className="profile-title">프로필 등록</h1>
                <form onSubmit={handleSubmit}>
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
                    <div className="field-container">
                        <label className="label">이미지 업로드</label>
                        <div className="custom-file-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                id="file-upload" // id 추가
                            />
                            <label htmlFor="file-upload">파일 선택</label> {/* 라벨 클릭 시 파일 선택 */}
                        </div>
                    </div>
                    {imagePreview && (
                        <div className="image-preview-container">
                            <img src={imagePreview} alt="미리보기" className="image-preview" />
                        </div>
                    )}
                    <div className="button-container">
                        <button className="update-button" type="submit" disabled={user_no === null}>프로필 등록</button>
                    </div>
                </form>
                {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
};

export default ProfileRegister;
