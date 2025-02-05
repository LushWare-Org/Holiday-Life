import React from 'react';
import Navigation from './components/Navigation';
import { Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import Tours from './screens/Tours';
import Register from './screens/Register';
import Login from './screens/Login';
import Contact from './screens/Contact';
import AdminPanel from './screens/AdminPanel';
import TourDetails from './screens/TourDetails';
import Itinerary from './screens/Itinerary'; 
import { CurrencyProvider } from './screens/CurrencyContext';
import axios from 'axios';

axios.defaults.baseURL = "http://lushtravels.site:8000";

const App = () => {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path='/' element={<CurrencyProvider><HomeScreen /></CurrencyProvider>} />
        <Route path='/tours' element={<CurrencyProvider><Tours /></CurrencyProvider>} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/admin' element={<AdminPanel />} />
        <Route path='/tours/:id' element={<TourDetails />} />
        <Route path='/itinerary/:id' element={<Itinerary />} /> 
      </Routes>
    </div>
  );
};

export default App;