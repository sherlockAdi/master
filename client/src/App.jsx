import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CountriesPage from './pages/CountriesPage';
import StatesPage from './pages/StatesPage';
// Import other pages when they are created
// import StatesPage from './pages/StatesPage';
// etc.

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/states" element={<StatesPage />} />
          {/* <Route path="/states" element={<StatesPage />} /> */}
          {/* Add other routes here */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
