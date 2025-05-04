import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddVaccineModal from './Modals/AddVaccineModal';
import EditVaccineModal from './Modals/EditVaccineModal';
import { addVaccineDrive, editVaccineDrive, getAllVaccines,deleteVaccine } from '../apiActions/vaccineActions';
import "./Vaccination.scss";
const Vaccination = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVaccineData, setSelectedVaccineData] = useState({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [vaccinationData, setVaccinationData] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null) {
            alert("Please login to access this page");
            navigate('/');
        }
        getAllVaccines().then((res) => {
            setVaccinationData(res.data)
        }
        ).catch((err) => {
            console.log(err);
        })
    }, [])
    const calculateStatus = (date) => {
        const today = new Date();
        const vaccinationDate = new Date(date);

        if (vaccinationDate < today) {
            return "Expired";
        } else {
            return "Upcoming";
        }
    };
    const handleEditVaccineDrive = (vaccineId,vaccineData) => {
        editVaccineDrive(vaccineId, vaccineData)
            .then((res) => {
                console.log("Vaccine drive edited successfully:", res);
                setVaccinationData((prevData) =>
                    prevData.map((vaccination) =>
                        vaccination.vaccineId === vaccineId ? { ...vaccination, ...vaccineData } : vaccination
                    )
                );
                setIsEditModalOpen(false);
            })
            .catch((err) => {
                setError(err.response?.data?.message);
                setIsEditModalOpen(true);
                console.error("Error editing vaccine drive:", err);
            });
    };
    const handleAddVaccineDrive = (vaccineData) => {
        addVaccineDrive(vaccineData)
            .then((res) => {
                console.log("Vaccine drive added successfully:", res);
                setError("");
                setVaccinationData((prevData) => [...prevData, res.data]); 
                setIsModalOpen(false);
            })
            .catch((err) => {
                setError(err.response?.data?.message);
                setIsModalOpen(true);
                console.error("Error adding vaccine drive:", err);
            });
    };
    const handleDelete=(vaccineId)=>{
        deleteVaccine(vaccineId)
        .then((res) => {
            console.log("Vaccine drive deleted successfully:", res);
            setVaccinationData((prevData) =>
                prevData.filter((vaccination) => vaccination.vaccineId !== vaccineId)
            );
        })
    }

    return (
        <div className="vaccination">
            <h1>Vaccination Drives</h1>
            <button className="add-vaccine-btn" onClick={()=>setIsModalOpen(true)}>
                Add Vaccine Drive
            </button>
            {vaccinationData.length === 0 && <p>No vaccination data found</p>}
            {vaccinationData.length > 0 &&
                <>
                    <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                        <thead>
                            <tr>
                                <th>Vaccination Name</th>
                                <th>Vaccination ID</th>
                                <th>Date</th>
                                <th>Available vaccines</th>
                                <th>Applicable Classes</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vaccinationData.map((vaccination) => {
                                const status = calculateStatus(vaccination.date);
                                return (
                                    <tr key={vaccination.vaccineId}>
                                        <td>{vaccination.vaccineName}</td>
                                        <td>{vaccination.vaccineId}</td>
                                        <td>{vaccination.date}</td>
                                        <td>{vaccination.available}</td>
                                        <td>{vaccination.applicableClasses.join(", ")}</td>
                                        <td>{status}</td>
                                        <td>
                                            {status === "Upcoming" && (
                                                <>
                                                <button
                                                    className="edit-btn"
                                                    disabled={status === "Expired"}
                                                    onClick={()=>{setSelectedVaccineData(vaccination);setIsEditModalOpen(true)}}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={()=>{handleDelete(vaccination.vaccineId)}}>
                                                        Delete
                                                </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </>}
                   {isModalOpen &&  <AddVaccineModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddVaccineDrive}
                error={error}
            />}
           {isEditModalOpen && <EditVaccineModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditVaccineDrive}
                vaccineData={selectedVaccineData}
                error={error}
            />}
                
        </div>
    );


}

export default Vaccination;
