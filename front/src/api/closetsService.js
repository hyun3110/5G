import axios from "axios";
import { API_URL } from '../config/config';

// 의류 가져오기
export const getClosets = async (userId) => {

    try {
        const response = await axios.get(`${API_URL}/api/closets/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("옷장 데이터를 가져오는 데 실패했습니다.", error);
    }

};

export const upload = async (formData) => {

    try {
        const response = await axios.post(`${API_URL}/api/closets/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200 || response.status === 201) {
            return response
        }
    } catch (error) {
        console.error("이미지 업로드 중 오류 발생:", error);
    }

}