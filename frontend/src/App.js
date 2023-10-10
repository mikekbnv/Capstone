import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Col, Row } from 'antd';
//TODO: replace proto file name with access and change importing names
import Navbar from './components/Navbar';
import Entrance from "./pages/entrance";
import Exit from "./pages/exit";
import ListEmployees from "./pages/listemployees";
import "./App.css";
import AddEmployee from './pages/addemployee';

function App() {
  return (
    <Row justify="center">
      <Col xs={{ span: 22 }} md={{ span: 12 }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/entrance" Component={Entrance} />
            <Route path="/exit" Component={Exit} />
            <Route path="/addemployee" Component={AddEmployee} />
            <Route path="/listemployees" Component={ListEmployees} />
          </Routes>
        </Router>
      </Col>
    </Row>
  );
}

export default App;