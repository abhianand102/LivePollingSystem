import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Welcome from './pages/Welcome';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentView from './pages/StudentView';
import './App.css';

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentView />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
