import React, { useState,useEffect } from "react";
import Modal from "react-modal";
import "./VaccineModal.scss";
const AddVaccineModal = ({ isOpen, onClose, onSubmit, error }) => {
    const [name, setName] = useState("");
    const [vaccineId, setVaccineId] = useState("");
    const [date, setDate] = useState("");
    const [available, setAvailable] = useState(0);
    const [classes, setClasses] = useState("");
    useEffect(()=>{
        error=="" && 
            setName("");
            setVaccineId("");
            setDate("");
            setAvailable(0);
            setClasses("");
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        const vaccineData = {
            name,
            vaccineId,
            date,
            available,
            classes: classes.split(",").map((cls) => cls.trim()),
        };
        onSubmit(vaccineData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="vaccine-modal"
        >
            <h2>Add Vaccine Drive</h2>
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
                    value={vaccineId}
                    onChange={(e) => setVaccineId(e.target.value)}
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
                    onChange={(e) => {
                        setClasses(e.target.value)
                    }}
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
                {error && <p>{error}</p>}
            </form>
        </Modal>
    );
};

export default AddVaccineModal;