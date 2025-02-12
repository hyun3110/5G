import axios from "axios";
import { API_URL } from '../config/config';

// 추천의류 가져오기
export const getCoordi = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/api/coordisets/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("통신오류.", error);
    }
};

// 추천의류 즐찾
export const pickCoordi = async (updateCoordi) => {
    try {
        const response = await axios.put(`${API_URL}/api/coordisets/update`, { updateCoordi }, { withCredentials: true, });
        return response.data;
    } catch (error) {
        console.error("통신오류.", error);
    }
}

export const getPickCoordi = async (userId) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/coordisets/pick?userId=${userId}`, { withCredentials: true, }
        );
        return response.data;
    } catch (error) {
        console.error('서버 오류:', error.response ? error.response.data : error.message);
    }
};