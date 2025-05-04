import React, { useState,useEffect } from "react";
import Modal from "react-modal";
import "./VaccineModal.scss";
const EditStudentModal = ({ isOpen, onClose, studentData,getAll,onSubmit }) => {
    const [name, setName] = useState("");
    const [className, setClassName] = useState("");
    useEffect(()=>{
        setName(studentData.name || "");
        setClassName(studentData.class || "");
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        const student = {
            name,
            className,
        };
        onSubmit(studentData.ID,student);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="vaccine-modal"
        >
            <h2>Edit Student Detauls</h2>
            <form className="vaccine-form">
                <input
                    type="text"
                    placeholder="Student Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="Class"
                    placeholder="Class"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                />
                <div className="modal-buttons">
                    <button type="submit" className="submit-btn" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button type="button" className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditStudentModal;