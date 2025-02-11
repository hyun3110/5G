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

// 로그아웃
export const logout = async () => {
  try {
    // 로그아웃 API 호출 (세션 무효화)
    const response = await axios.post(
      `${API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    if (response.status === 200) {
      return response
    }
  } catch (error) {
    console.error("로그아웃 실패", error);
    throw error;
  }
};

// 아이디 확인
export const idCheck = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/useridcheck`, {
      params: { userId },
    }, { withCredentials: true });
    return response.data
  } catch (error) {
    console.error("아이디 중복 확인 오류:", error);
  }
}

// 회원가입
export const userSignup = async (signupData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, signupData, { withCredentials: true });
    return response
  } catch (error) {
    console.error("통신 오류:", error);
  }
}

// 회원정보 변경
export const userEdit = async (updateData) => {
  try{
    const response = await axios.put(`${API_URL}/api/auth/useredit`, updateData, { withCredentials: true });
    if (response.status === 200 || response.status === 201){
      return response.data
    }
 } catch (error) {
  console.error("통신 오류:", error);
}
}