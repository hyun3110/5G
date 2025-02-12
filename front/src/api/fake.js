import axios from "axios";
import { API_URL } from '../config/config';

export const fake = async (idx) => {
    try {
        const response = await axios.get(`${API_URL}/api/fake/`, {
            params: {
                id: idx
            },
            withCredentials: true
        });
        return response.data
    } catch (error) {
        console.error("통신 오류:", error);
    }
}

export const a = async (userId, url) => {
    try {
        const response = await axios.get(`${API_URL}/api/coordisets/`, {
            params: {
                userId: userId,
                url: url
            },
            withCredentials: true
        });
    } catch (error) {
        console.error("통신 오류:", error);
    }
}