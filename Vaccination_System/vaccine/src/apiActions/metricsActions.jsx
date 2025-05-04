import api from "../utils/axios";
import { API_URL } from "../constants/apiConstants";

export const getMetrics=async()=>{
    const response=await api.get(`${API_URL}/metrics`);
    if(response.status===200){
        return response.data;
    }
    else{
        throw new Error('Failed to fetch metrics');
    }
}