import axios from 'axios';
import { API_URL } from '../constants/apiConstants';
export const loginActions=async(data)=>{
    const response=await axios.post(`${API_URL}/admin/login`,data);
    return response;
}