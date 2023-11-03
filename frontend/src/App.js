import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import { Col, Divider, Row } from 'antd';
import Navbar from './components/Navbar';
import Entrance from "./pages/entrance";
import Exit from "./pages/exit";
import ListEmployees from "./pages/listemployees";
import "./App.css";
import AddEmployee from './pages/addemployee';
import ListTest from './pages/listemployeestest';

function App() {
  return (
    <Row justify="center">
      <Col xs={{ span: 22 }} md={{ span: 12 }}>
      
        <Router>
          <Routes>
            {/* /employee/entr / exit */}
            <Route path="/" element={<MainNav/>} />
            <Route path="/employee" element={<EmployeeLayout />}>
              <Route path="/employee/entrance" element={<Entrance/>} />
              <Route path="/employee/exit" element={<Exit/>} />
            </Route>
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="/admin/addemployee" element={<AddEmployee />} />
              <Route path="/admin/listemployees" element={<ListEmployees/>} />
              
            </Route>
           
          </Routes>
        </Router>
      </Col>
    </Row>
  );
}

const EmployeeLayout = () => {
  const items = [
    { key: '/', label: 'Back to menu' },
    { key: '/employee/entrance', label: 'Entrance' },
    { key: '/employee/exit', label: 'Exit' },
  ];

  return (
    <>
      <Navbar items={items} />
      <Outlet />
    </>
  );
}

const AdminLayout = () => {
  const items = [
    { key: '/', label: 'Back to menu' },
    { key: '/admin/addemployee', label: 'Add Employee' },
    { key: '/admin/listemployees', label: 'List Employees' },
  ];
  
  return (
    <>
      <Navbar items={items} />
      <Outlet />
    </>
  );
}

const MainNav = () => {
  const items = [
    { key: '/admin', label: 'Admin' },
    { key: '/employee', label: 'Employee' },
  ];
  
  return <Navbar items={items} />
}
 
export default App;