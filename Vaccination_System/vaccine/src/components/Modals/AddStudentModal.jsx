import React, { useState ,useRef} from 'react';
import Modal from 'react-modal';
import Papa from "papaparse";
import { addStudent , bulkUploadFile} from '../../apiActions/studentActions';
import "./AddStudentModal.scss";
const AddStudentModal = ({ isOpen, onClose , getAll}) => {
    const [name, setName] = useState("");
    const [className, setClassName] = useState("");
    const [id, setId] = useState("");
    const [file, setFile] = useState(null);
    const [error,setError]=useState("");
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(file!==null && fileInputRef.current.files.length>0){

            const file = fileInputRef.current.files[0];
            console.log(file)
            if (!file) {
                alert("Please select a file");
                return;
            }
            const form=new FormData();
            form.append("file",file);
            const fileName = file.name;
            const fileExtension = fileName.split(".").pop();
            if (fileExtension !== "csv") {
                alert("Please upload a CSV file");
                return;
            }

           bulkUploadFile(form)
                .then((res) => {
                    console.log("File uploaded successfully:", res);
                    getAll()
                    onClose(); // Close the modal after successful submission
                })
                .catch((err) => {
                    console.error("Error uploading file:", err.message);
                    setError(err.response.data.message)
                    
                });
            return;
        }
        if (name === "" || className === "" || id === "") {
            alert("Please fill in all fields");
            return;
        }
        const studentData = {
            name,
            className,
            ID: id,
        };
        addStudent(studentData)
            .then((res) => {
                console.log("Student added successfully:", res);
                getAll()
                onClose(); // Close the modal after successful submission
            })
            .catch((err) => {
                console.error("Error adding student:", err.message);
                setError(err.response.data.message)
                
            });
        setName("");
        setClassName("");
        setId("");
        setFile(null); // Clear the file state
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input field
        }

        console.log("Student added:", { name, className, id, file });
    };
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleRemoveFile = () => {
        setFile(null); // Clear the file state
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input field
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} className="add-student-modal">
            <h2>Add Student</h2>
            <form onSubmit={handleSubmit} className="add-student-form">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    disabled={file !== null}
                    onChange={(e) => setName(e.target.value)}
                    required
                    title={file!==null ?"Remove file to enable":"Enter Name"}
                />
                <input
                    type="text"
                    placeholder="Class"
                    value={className}
                    disabled={file !== null}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                    title={file!==null ?"Remove file to enable":"Enter Class Name"}
                />
                <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    disabled={file !== null}
                    onChange={(e) => setId(e.target.value)}
                    title={file!==null ?"Remove file to enable":"Enter ID"}
                />
                <p style={{ textAlign: "center" }}>OR</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} disabled={name !== "" || className !== "" || id !== ""} title={name !== "" || className !== "" || id !== "" ? "Empty the fields above to enable" : "Upload file"} />
                {file!==null && (
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="remove-file-btn"
                        title="Remove the selected file"
                    >
                        Remove File
                    </button>
                )}
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="modal-buttons">
                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                    <button type="button" className="close-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </form>
        </Modal>
    );
}
export default AddStudentModal;