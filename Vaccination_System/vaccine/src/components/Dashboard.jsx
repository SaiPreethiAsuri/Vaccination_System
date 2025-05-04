import { useEffect, useState } from "react";
import { getMetrics } from "../apiActions/metricsActions";
import { upcomingDrives } from "../apiActions/vaccineActions";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
    const [metricsData, setMetricsData] = useState();
    const [upcomingDrivesData, setUpcomingDrivesData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null) {
            alert("Please login to access this page");
            navigate('/');
        }
        getMetrics().then((res) => {
            setMetricsData(res.data)

        }
        ).catch((err) => {
            console.log(err);
        })
        upcomingDrives().then((res) => {
            setUpcomingDrivesData(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }
        , [])
    return (
        <div>
            {metricsData &&
                (<div>
                    <p>Total number of students: {metricsData.totalStudents}</p>
                    <p>Total number of students vaccinated: {metricsData.vaccinatedCount}</p>
                    <p>Total number of vaccine drives: {metricsData.totalVaccines}</p>
                    <p>Vaccination Students Percentage {metricsData.vaccinatedStudentsPercentage}</p>
                    <p>Unvaccinated Students Percentage {metricsData.unvaccinatedStudentsPercentage}</p>
                </div>
                )}
            <h1>Upcoming Vaccine Drives</h1>
            {upcomingDrivesData && upcomingDrivesData.length === 0 && <p>No upcoming drives</p>}
            {upcomingDrivesData && upcomingDrivesData.length > 0 && <p>Upcoming drives are listed below</p> &&
                <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Applicable Classes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingDrivesData.map((drive, index) => (
                            <tr key={index}>
                                <td>{drive.vaccineId}</td>
                                <td>{drive.vaccineName}</td>
                                <td>{drive.date}</td>
                                <td>{drive.applicableClasses.join(", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}



        </div>
    )
}
export default Dashboard;