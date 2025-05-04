import api from "../utils/axios";
import { API_URL } from "../constants/apiConstants";

export const getStudentDetails = async (studentId) => {
    try {
        const response = await api.get(`${API_URL}/student/${studentId}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch student details');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export const getStudentVaccinationStatus = async (studentId) => {
    try {
        const response = await api.get(`${API_URL}/student/${studentId}/vaccination-status`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch vaccination status');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export const getAllStudents=async(page,limit)=>{
    try{
        const response=await api.get(`${API_URL}/student?page=${page}&limit=${limit}`);
        if(response.status===200){
            return response.data;
        }
        else{
            throw new Error('Failed to fetch all students');
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
}
export const addStudent=async(studentData)=>{
    try{
        const response=await api.post(`${API_URL}/student/add`,studentData);
        if(response.status===200){
            return response.data;
        }
        else{
            throw new Error('Failed to add student');
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
}
export const editVaccinationStatus=async(studentId,vaccineId,status)=>{
    try{
        const response=await api.put(`${API_URL}/student/${studentId}/vaccination-status/${vaccineId}`,{status});
        if(response.status===200){
            return response.data;
        }
        else{
            throw new Error('Failed to edit vaccination status');
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
}
export const deleteVaccinationRegistration=async(studentId,vaccineId)=>{
    try{
        const response=await api.delete(`${API_URL}/student/${studentId}/${vaccineId}`);
        if(response.status===200){
            return response.data;
        }
        else{
            throw new Error('Failed to delete vaccination registration');
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
}
export const bulkUploadFile=async(fileData)=>{
    try{
        const response=await api.post(`${API_URL}/student/bulk-upload`,fileData);
        if(response.status===200){
            return response.data;
        }
        else{
            throw new Error('Failed to upload file');
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
}
export const editStudentDetails=async(studentId,studentData)=>{
    try{
        const response=await api.put(`${API_URL}/student/${studentId}`,studentData);
        if(response.status===200){
            return response.data;
        }
        else{
            throw new Error('Failed to edit student details');
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
}
export const deleteStudent=async(studentId)=>{
    try{
        const response=await api.delete(`${API_URL}/student/${studentId}`);
        if(response.status===200){
            return response.data;
        }
        else{
            throw new Error('Failed to delete student');
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
}