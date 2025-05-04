import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/login';
import './App.css';
import Dashboard from './components/Dashboard';
import Student from './components/Student';
import Vaccination from './components/Vaccination';
import SideBar from './components/SideBar';
import  Reports  from './components/Reports';

function AppContent() {
  const location = useLocation(); // Now inside the Router context

  return (
    <div className="app">
      {/* Render SideBar only if the current route is not "/" */}
      {location.pathname !== '/' && <SideBar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Student/>}/>
          <Route path="/vaccination" element={<Vaccination/>} />
          <Route path="/reports" element={<Reports/>} />
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
