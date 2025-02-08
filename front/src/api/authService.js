import axios from "axios";
import { API_URL } from '../config/config';

// 로그인 요청 함수
export const loginUser = async (userId, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        userId: userId,
        pw: password,
      },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return true;  // 로그인 성공
    } else {
      throw new Error("로그인 실패");
    }
  } catch (err) {
    throw new Error("요청 실패!");
  }
};

// 유저 정보 가져오기 함수
export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/userinfo`, {
      withCredentials: true,
    });
    return response.data;  // 유저 정보 반환
  } catch (err) {
    throw new Error("유저 정보를 가져오는 데 실패했습니다.");
  }
};
