import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./VaccineModal.scss";
const EditVaccineModal = ({ isOpen, onClose, onSubmit, vaccineData,error }) => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [available, setAvailable] = useState(0);
    const [classes, setClasses] = useState("");

    // Update state when vaccineData changes
    useEffect(() => {
        if (vaccineData) {
            setName(vaccineData.vaccineName || "");
            setDate(vaccineData.date || "");
            setAvailable(vaccineData.available || 0);
            setClasses(vaccineData.applicableClasses?.join(", ") || "");
        }
    }, [vaccineData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !date || !available || !classes) {
            alert("Please fill in all fields");
            return;
        }

        const vaccineDataNew = {};
        if (name !== vaccineData.vaccineName) vaccineDataNew.name = name;
        if (date !== vaccineData.date) vaccineDataNew.date = date;
        if (available !== vaccineData.available) vaccineDataNew.available = available;
        if (classes !== vaccineData.applicableClasses?.join(", ")) {
            vaccineDataNew.classes = classes.split(",").map((cls) => cls.trim()); 
        }
        onSubmit(vaccineData.vaccineId, vaccineDataNew); 
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="vaccine-modal"
        >
            <h2>Edit Vaccine Drive</h2>
            <form onSubmit={handleSubmit} className="vaccine-form">
                <input
                    type="text"
                    placeholder="Vaccination Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Vaccination ID"
                    value={vaccineData.vaccineId}
                    disabled
                    required
                />
                <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Available Doses"
                    value={available}
                    onChange={(e) => setAvailable(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Applicable Classes (comma-separated)"
                    value={classes}
                    onChange={(e) => setClasses(e.target.value)}
                    required
                />
                <div className="modal-buttons">
                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                    <button type="button" className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </form>
        </Modal>
    );
};

export default EditVaccineModal;