import api from "../utils/axios";
import { API_URL } from "../constants/apiConstants";

export const upcomingDrives=async(req,res)=>{
    const response=await api.get(`${API_URL}/vaccine/upcoming`);
    if(response.status===200){
        return response.data;
    }
    else{
        throw new Error('Failed to fetch upcoming drives');
    }
}
export const getAllVaccines=async(req,res)=>{
    const response=await api.get(`${API_URL}/vaccine/`);
    if(response.status===200){
        return response.data;
    }
    else{
        throw new Error('Failed to fetch all vaccines');
    }
}
export const addVaccineDrive=async(vaccineData)=>{
    const response=await api.post(`${API_URL}/vaccine/add`,vaccineData);
    if(response.status===200){
        return response.data;
    }
    else{
        throw new Error('Failed to add vaccine drive');
    }
}
export const editVaccineDrive=async(vaccineId,vaccineData)=>{
    const response=await api.put(`${API_URL}/vaccine/${vaccineId}`,vaccineData);
    if(response.status===200){
        return response.data;
    }
    else{
        throw new Error('Failed to edit vaccine drive');
    }
}
export const deleteVaccine=async(vaccineId)=>{
    const response=await api.delete(`${API_URL}/vaccine/${vaccineId}`);
    if(response.status===200){
        return response.data;
    }
    else{
        throw new Error('Failed to delete vaccine drive');
    }
}
