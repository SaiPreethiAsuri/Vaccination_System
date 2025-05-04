import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { editVaccinationStatus, getAllStudents, deleteVaccinationRegistration, editStudentDetails, deleteStudent } from '../apiActions/studentActions';
import "./Student.scss";
import AddStudentModal from './Modals/AddStudentModal';
import EditStudentModal from './Modals/EditStudentModal'; 
import { UpdateVaccinationStatusModal } from './Modals/UpdateVaccinationStatusModal';
const Student = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [selectedStudentData, setSelectedStudentData] = React.useState({});
    const [currentTotalPages, setCurrentTotalPages] = React.useState(1);
    const [isVaccineModalOpen, setVaccineModalOpen] = React.useState(false);
    const [students, setStudents] = React.useState([]);
    const [studentId, setStudentId] = React.useState("");
    const [filters, setFilters] = React.useState({
        id: "",
        name: "",
        class: ""
    });
    const [filteredStudents, setFilteredStudents] = React.useState([]);
    const getAll = (page = 1, limit = 10) => {
        getAllStudents(page, limit).then((res) => {
            setStudents(res.students)
            setFilteredStudents(res.students)
            setCurrentTotalPages(res.totalPages)
            setTotalPages(res.totalPages)
            setCurrentPage(page);
        }
        ).catch((err) => {
            console.log(err);
        })
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null) {
            alert("Please login to access this page");
            navigate('/');
        }
        getAll();


    }, [])
    useEffect(() => {
        const filtered = students.filter((student) => {
            return (
                (filters.id === "" || student.ID.toLowerCase().includes(filters.id.toLowerCase())) &&
                (filters.name === "" || student.name.toLowerCase().includes(filters.name.toLowerCase()))
            );
        });
        setFilteredStudents(filtered);
        if (filtered.length !== students.length) {

            setTotalPages(Math.ceil(filtered.length / 10));
        }
        else {
            setTotalPages(currentTotalPages);
        }
    }, [filters, students]);
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };
    const handleDelete = (studentId) => {
        deleteStudent(studentId).then((res) => {
            console.log(res);
            getAll();
        }
        ).catch((err) => {
            console.log(err);
        })
    }
    const handleModalOpen = () => {
        setIsOpen(true);
    }
    const onDeleteVaccine = (studentId, vaccineId) => {
        deleteVaccinationRegistration(studentId, vaccineId).then((res) => {
            console.log(res);
            getAll();
        }).catch((err) => {
            console.log(err);
        })

    }
    const handleEdit=(studentId,studentData)=>{
        editStudentDetails(studentId,studentData).then((res) => {
            console.log(res);
            setEditModalOpen(false);
            getAll();
        }        ).catch((err) => {
            console.log(err);
        })
    }
    const onAddVaccine = (studentId, vaccineId, status) => {
        editVaccinationStatus(studentId, vaccineId, status).then((res) => {
            console.log(res);
            getAll();
        }
        ).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div className="student">
            <h1>Student Management</h1>
            <button className="add-student-btn" onClick={handleModalOpen}>
                Add Student
            </button>
            <>
                <div className="filters" style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <input
                        type="text"
                        name="id"
                        placeholder="Filter by ID"
                        value={filters.id}
                        onChange={handleFilterChange}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Filter by Name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                </div>
                {filteredStudents.length === 0 && <p>No students found</p>}
                {filteredStudents.length > 0 && <p>Students are listed below</p> &&
                    <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Vaccination Name</th>
                                <th>Vaccination Date</th>
                                <th>Vaccination Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents?.map((student) => (
                                <React.Fragment key={student.ID}>
                                    <tr key={student._id}>
                                        <td rowSpan={student.vaccinationStatus.length || 1}>{student.ID}</td>
                                        <td rowSpan={student.vaccinationStatus.length || 1}>{student.name}</td>
                                        <td rowSpan={student.vaccinationStatus.length || 1}>{student.class}</td>
                                        
                                        {student.vaccinationStatus.length > 0 ? (
                                                <>
                                                    <td>{student.vaccinationStatus[0].vaccine.vaccineName}</td>
                                                    <td>{student.vaccinationStatus[0].vaccine.date}</td>
                                                    <td>{student.vaccinationStatus[0].status ? "Vaccinated" : "Not Vaccinated"}</td>
                                                </>
                                            ) : (
                                                <td colSpan="3" style={{ textAlign: "center" }}>
                                                    No Vaccination Status
                                                </td>
                                            )}
                                             <td rowSpan={student.vaccinationStatus.length || 1}>
                                            <button
                                                className="edit-btn"
                                                onClick={() => { setStudentId(student.ID); setVaccineModalOpen(true) }}
                                            >
                                                Status
                                            </button>
                                            <button
                                                    className="edit-btn"
                                                    onClick={()=>{setSelectedStudentData(student);setEditModalOpen(true)}}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={()=>{handleDelete(student.ID)}}>
                                                        Delete
                                                </button>
                                        </td>
                                        </tr>
                                        {student.vaccinationStatus.slice(1).map((status, index) => (
                                            <tr key={`${student.ID}-status-${index}`}>
                                                <td>{status.vaccine.vaccineName}</td>
                                                <td>{status.vaccine.date}</td>
                                                <td>{status.status ? "Vaccinated" : "Not Vaccinated"}</td>
                                            </tr>
                                        ))}
                                       
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>}

                <div style={{ marginTop: "10px", textAlign: "center" }}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentPage(index + 1);
                                getAll(index + 1);
                            }}
                            style={{
                                margin: "0 5px",
                                padding: "5px 10px",
                                backgroundColor: currentPage === index + 1 ? "#007bff" : "#f0f0f0",
                                color: currentPage === index + 1 ? "#fff" : "#000",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

            </>
            {isOpen && (<AddStudentModal isOpen={isOpen} onClose={() => setIsOpen(false)} getAll={getAll} />)}
            {isVaccineModalOpen && (<UpdateVaccinationStatusModal isOpen={isVaccineModalOpen} onClose={() => setVaccineModalOpen(false)}
                onDeleteVaccine={onDeleteVaccine}
                onAddVaccine={onAddVaccine}
                studentId={studentId}
            />)}
            {editModalOpen && (<EditStudentModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} studentData={selectedStudentData} getAll={getAll} onSubmit={handleEdit} />)}
        </div>


    );
}
export default Student;