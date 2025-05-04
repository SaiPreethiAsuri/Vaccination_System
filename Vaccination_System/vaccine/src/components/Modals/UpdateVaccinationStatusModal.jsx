import { editVaccinationStatus, getStudentDetails } from "../../apiActions/studentActions";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getAllVaccines } from "../../apiActions/vaccineActions";
import "./UpdateVaccinationStatusModal.scss";
export const UpdateVaccinationStatusModal = ({ isOpen,
    onClose,
    onEditVaccine,
    onDeleteVaccine,
    onAddVaccine,
    studentId,
}) => {
    const [activeTab, setActiveTab] = useState("edit"); // "edit" or "add"
    const [selectedVaccine, setSelectedVaccine] = useState("");
    const [vaccinationData, setVaccinationData] = useState([]);
    const [studentData, setStudentData] = useState()
    const [editedData, setEditedData] = useState();
    const [selectedVaccineDate, setSelectedVaccineDate] = useState("");
    const [registeredVaccinations, setRegisteredVaccinations] = useState([]);
    const [unregisteredVaccinations, setUnregisteredVaccinations] = useState([]);
    const [status, setStatus] = useState(false);
    useEffect(() => {
        getAllVaccines().then((res) => {
            setVaccinationData(res.data)
        }
        ).catch((err) => {
            console.log(err);
        })
        getStudentDetails(studentId).then((res) => {
            setStudentData(res.data);
        }).catch((err) => {
            console.log(err)
        })


    }, [])
    useEffect(() => {
        if (vaccinationData.length > 0 && studentData) {
            // Find vaccinations the student is registered for
            const registered = vaccinationData.filter((vaccine) =>
                studentData.vaccinationStatus.some(
                    (studentVaccine) => studentVaccine.vaccine.vaccineId === vaccine.vaccineId
                )
            );

            const studentClass=studentData.class
            const unregistered = vaccinationData.filter(
                (vaccine) =>
                    !studentData.vaccinationStatus.some(
                        (studentVaccine) => studentVaccine.vaccine.vaccineId === vaccine.vaccineId
                    ) &&
                    vaccine.applicableClasses.includes(studentClass)
            );

            setRegisteredVaccinations(registered);
            setUnregisteredVaccinations(unregistered);
        }
    }, [vaccinationData, studentData]);
    const handleEditStatusChange = (
        vaccineId, newStatus) => {
        onAddVaccine(studentId, vaccineId, newStatus);
        onClose();

    };

    const handleDeleteVaccine = (vaccineId) => {
        onDeleteVaccine(studentId, vaccineId);
        onClose();

    };

    const handleAddVaccine = (e) => {
        e.preventDefault();
        if (selectedVaccine === "") {
            alert("Please select a vaccine.");
            return;
        }
        const selectedVaccineObject = unregisteredVaccinations.find(
            (vaccine) =>
                vaccine.vaccineName === selectedVaccine &&
                vaccine.date === selectedVaccineDate
        );

        if (selectedVaccineObject) {
            console.log("Selected Vaccine ID:", selectedVaccineObject.vaccineId);
        } else {
            console.log("No matching vaccine found.");
        }
        onAddVaccine(studentId, selectedVaccineObject.vaccineId, status);
        setSelectedVaccine("");
        setStatus(false);
        onClose()
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="update-vaccine-modal"
        >
            <h2>Update Vaccination Status</h2>
            <div className="tabs">
                <button
                    className={`tab ${activeTab === "edit" ? "active" : ""}`}
                    onClick={() => setActiveTab("edit")}
                >
                    Edit
                </button>
                <button
                    className={`tab ${activeTab === "add" ? "active" : ""}`}
                    onClick={() => setActiveTab("add")}
                >
                    Add
                </button>
            </div>

            {activeTab === "edit" && (
                <div className="edit-tab">
                    <h3>Edit Vaccination Records</h3>
                    {registeredVaccinations.length === 0 ? (
                        <p>No vaccinations found for this student.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Vaccine Name</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registeredVaccinations.map((vaccine) => {
                                    let currentStatus = studentData.vaccinationStatus.find(
                                        (v) => v.vaccine.vaccineId === vaccine.vaccineId
                                    )?.status;
                                    return (<tr key={vaccine.vaccineId}>
                                        <td>{vaccine.vaccineName}</td>
                                        <td>
                                            <select
                                                value={
                                                    editedData === undefined ? currentStatus ? "Vaccinated" : "Not Vaccinated" :
                                                        editedData.vaccineId === vaccine.vaccineId && editedData.status === true ?
                                                            "Vaccinated" : editedData.vaccineId === vaccine.vaccineId && editedData.status === false ? "Not Vaccinated" : null
                                                }
                                                onChange={(e) => {
                                                    currentStatus = e.target.value === "Vaccinated" ? true : false
                                                    setEditedData({ vaccineId: vaccine.vaccineId, status: currentStatus })
                                                }
                                                }
                                                required

                                            >
                                                <option value="Vaccinated">Vaccinated</option>
                                                <option value="Not Vaccinated">Not Vaccinated</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleEditStatusChange(editedData.vaccineId, editedData.status)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteVaccine(vaccine.vaccineId)}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === "add" && (
                <div className="add-tab">
                    <h3>Add Vaccination Record</h3>
                    <form onSubmit={handleAddVaccine}>
                        <div className="form-group add-form-group">
                            <label htmlFor="vaccine">Select Vaccine:</label>
                            <select
                                id="vaccine"
                                value={selectedVaccine}
                                defaultValue={selectedVaccine}
                                onChange={(e) => { setSelectedVaccine(e.target.value); setSelectedVaccineDate("") }}
                                required
                            >
                                <option value="" disabled>
                                    -- Select Vaccine --
                                </option>
                                {Array.from(
                                    new Set(
                                        unregisteredVaccinations.map((vaccine) => vaccine.vaccineName)
                                    )
                                ).map((vaccineName, index) => (
                                    <option key={index} value={vaccineName}>
                                        {vaccineName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="vaccineDate">Select Vaccine Date:</label>
                            <select
                                id="vaccineDate"
                                value={selectedVaccineDate}
                                onChange={(e) => setSelectedVaccineDate(e.target.value)}
                                required
                                disabled={!selectedVaccine} // Disable the date dropdown until a vaccine name is selected
                            >
                                <option value="" disabled>
                                    -- Select Vaccine Date --
                                </option>
                                {unregisteredVaccinations
                                    .filter((vaccine) => vaccine.vaccineName === selectedVaccine)
                                    .map((vaccine) => (
                                        <option key={vaccine.vaccineId} value={vaccine.date}>
                                            {vaccine.date}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="form-group add-form-group">
                            <label htmlFor="status">Status:</label>
                            <select
                                id="status"
                                value={status ? "Vaccinated" : "Not Vaccinated"}
                                onChange={(e) => setStatus(e.target.value === "Vaccinated")}
                                required
                            >
                                <option value="Vaccinated">Vaccinated</option>
                                <option value="Not Vaccinated">Not Vaccinated</option>
                            </select>
                        </div>
                        <button type="submit" className="add-btn" onClick={handleAddVaccine}>
                            Add
                        </button>
                    </form>
                </div>
            )}

            <button className="close-btn" onClick={onClose}>
                Close
            </button>
        </Modal>
    );
}