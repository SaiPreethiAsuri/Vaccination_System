import { NavLink } from "react-router-dom";
import "./SideBar.scss";

const SideBar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">School Coordinator</h2>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link" activeClassName="active">
          Dashboard
        </NavLink>
        <NavLink to="/students" className="sidebar-link" activeClassName="active">
          Add/Manage Student Details
        </NavLink>
        <NavLink to="/vaccination" className="sidebar-link" activeClassName="active">
          Manage/Update Vaccination Status
        </NavLink>
        <NavLink to="/reports" className="sidebar-link" activeClassName="active">
          Generate Reports
        </NavLink>
      </nav>
    </div>
  );
};

export default SideBar;