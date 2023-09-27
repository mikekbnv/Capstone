import React from 'react';
import Navbar from './components/Navbar';
import Entrance from "./pages/entrance";
import Exit from "./pages/exit";
import "./App.css";

import { BrowserRouter as Router, Routes, Route }
    from 'react-router-dom';

function App() {
  
    return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/entrance" Component={Entrance} />
          <Route path="/exit" Component={Exit} />
        </Routes>
      </Router>
    );
}

export default App;