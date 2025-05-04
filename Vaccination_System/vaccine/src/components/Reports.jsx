import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import autoTable from "jspdf-autotable";
import { getAllStudents } from '../apiActions/studentActions';
const Reports = () => {
    const [students, setStudents] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [currentTotalPages, setCurrentTotalPages] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [filters, setFilters] = React.useState({
        id: "",
        name: "",
        class: "",
        vaccineName: "",
        vaccineDate: "",
        vaccinationStatus: ""
    });
    const [filteredStudents, setFilteredStudents] = React.useState([]);
    const getAll = (page = 1, limit = 10) => {
        getAllStudents(page, limit).then((res) => {
            setStudents(res.students)
            setFilteredStudents(res.students)
            setCurrentTotalPages(res.totalPages)
            setTotalPages(res.totalPages)
        }
        ).catch((err) => {
            console.log(err);
        })
    }
    const navigate = useNavigate();
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
                (filters.name === "" || student.name.toLowerCase().includes(filters.name.toLowerCase())) &&
                (filters.class === "" || student.class.toLowerCase().includes(filters.class.toLowerCase())) &&
                (filters.vaccineName === "" || student.vaccinationStatus.some((s) => s.vaccine.vaccineName.toLowerCase().includes(filters.vaccineName.toLowerCase()))) &&
                (filters.vaccineDate === "" || student.vaccinationStatus.some((s) => s.vaccine.date.toLowerCase().includes(filters.vaccineDate.toLowerCase())))

            );

        }).filter((student) => {
            if (filters.vaccinationStatus.length === 0) {
                return true; // No filter applied
            }

            // Check if any of the selected vaccination statuses match
            const matchesVaccinated = filters.vaccinationStatus.includes("vaccinated") &&
                student.vaccinationStatus.some((s) => s.status === true);

            const matchesNotVaccinated = filters.vaccinationStatus.includes("not vaccinated") &&
                student.vaccinationStatus.some((s) => s.status === false);

            const matchesNoVaccinationStatus = filters.vaccinationStatus.includes("no vaccination status") &&
                student.vaccinationStatus.length === 0;
            return matchesVaccinated || matchesNotVaccinated || matchesNoVaccinationStatus;
        })
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
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Student Vaccination Reports", 14, 10);
        let currPage=currentPage;
        const currentStudents=filteredStudents
        const tableColumn = ["Name", "ID", "Class", "Vaccine Name", "Vaccine Date", "Vaccination Status"];
        while(currPage<= totalPages){
            getAllStudents(currPage+1,10).then((res) => {
                currentStudents.push(...res.students);
            }
            ).catch((err) => {
                console.log(err);
            })
            currPage++;
        }
        const tableRows = currentStudents.flatMap((student) =>
            student.vaccinationStatus.length > 0
                ? student.vaccinationStatus.map((status) => [
                    student.name,
                    student.ID,
                    student.class,
                    status.vaccine.vaccineName,
                    status.vaccine.date,
                    status.status ? "Vaccinated" : "Not Vaccinated",
                ])
                : [
                    [
                        student.name,
                        student.ID,
                        student.class,
                        "No Vaccination Records",
                        "N/A",
                        "No Vaccination Status",
                    ],
                ]
        );

        // Add the table to the PDF
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        // Save the PDF
        doc.save("Student_Vaccination_Reports.pdf");
    };

    return (
        <div>

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
                    <input
                        type="text"
                        name="class"
                        placeholder="Filter by Class"
                        value={filters.class}
                        onChange={handleFilterChange}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <input
                        type="text"
                        name="vaccineName"
                        placeholder="Filter by Vaccine Name"
                        value={filters.vaccineName}
                        onChange={handleFilterChange}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <input
                        type="text"
                        name="vaccineDate"
                        placeholder="Filter by Vaccine Date"
                        value={filters.vaccineDate}
                        onChange={handleFilterChange}
                        style={{ marginRight: "10px", padding: "5px" }}
                    />
                    <div className="form-group">
                        <label>Vaccination Status:</label>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filters.vaccinationStatus.includes("vaccinated")}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFilters((prevFilters) => ({
                                            ...prevFilters,
                                            vaccinationStatus: checked
                                                ? [...prevFilters.vaccinationStatus, "vaccinated"]
                                                : prevFilters.vaccinationStatus.filter((status) => status !== "vaccinated"),
                                        }));
                                    }}
                                />
                                Vaccinated
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filters.vaccinationStatus.includes("not vaccinated")}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFilters((prevFilters) => ({
                                            ...prevFilters,
                                            vaccinationStatus: checked
                                                ? [...prevFilters.vaccinationStatus, "not vaccinated"]
                                                : prevFilters.vaccinationStatus.filter((status) => status !== "not vaccinated"),
                                        }));
                                    }}
                                />
                                Not Vaccinated
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={filters.vaccinationStatus.includes("no vaccination status")}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setFilters((prevFilters) => ({
                                            ...prevFilters,
                                            vaccinationStatus: checked
                                                ? [...prevFilters.vaccinationStatus, "no vaccination status"]
                                                : prevFilters.vaccinationStatus.filter((status) => status !== "no vaccination status"),
                                        }));
                                    }}
                                />
                                No Vaccination Status
                            </label>
                        </div>
                    </div>
                    <button onClick={handleDownloadPDF} style={{ padding: "10px", marginTop: "10px" }}>
                        Download as PDF
                    </button>

                </div>
                {filteredStudents.length === 0 && <p>No students found</p>}
                {filteredStudents.length > 0 && <p>Students are listed below</p> &&
                    <div>
                        <h1>Reports</h1>
                        <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>ID</th>
                                    <th>Class</th>
                                    <th>Vaccine Name</th>
                                    <th>Vaccine Date</th>
                                    <th>Vaccination Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <React.Fragment key={student.ID}>
                                        <tr>
                                            <td rowSpan={student.vaccinationStatus.length || 1}>{student.name}</td>
                                            <td rowSpan={student.vaccinationStatus.length || 1}>{student.ID}</td>
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
                        </table>
                    </div>}
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
        </div>)
}
export default Reports;
