import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import AllTours from '../components/AllTours';
import AddTour from '../components/AddTour';
import ContactInquiries from '../components/ContactInquiries';
import TourInquiries from '../components/TourInquiries';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function useDeviceType() {
  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType({
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

const { TabPane } = Tabs;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDeviceType();

  useEffect(() => {
    const token = localStorage.getItem('token');
    try{
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          navigate('/login');
        }
      }
      else {
        navigate('/login');
      }
    } catch (error) { 
      navigate('/login');
    }
    checkTokenExpiration();

    // Set an interval to check token expiration every second
    const intervalId = setInterval(checkTokenExpiration, 1000);

    // Clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [navigate]);



  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        background: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          marginTop:'3vh',
          marginBottom:'50px',
          maxWidth: isMobile? '100vw': isTablet? '90%': '80vw',
          background: '#fff',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          tabBarStyle={{
            background: '#e8f0fc',
            fontWeight: 'bold',
            fontSize: '20px',
            padding:isMobile? '0 2vw': isTablet? '0 20vw': '0 22vw',
            height: '7vh',
            margin: '0',

          }}
          style={{
            width: '100%',
          }}
        >
          <TabPane tab="Tours" key="1">
            <div style={{ padding:'30px' }}>
              <AllTours />
            </div>
          </TabPane>
          <TabPane tab="Add Tour" key="2">
            <div style={{ padding: '30px' }}>
              <AddTour />
            </div>
          </TabPane>
          <TabPane tab="Contact Inquiries" key="3">
            <div style={{ padding:  '30px' }}>
              <ContactInquiries />
            </div>
          </TabPane>
          <TabPane tab="Tour Inquiries" key='4'>
            <div style={{ padding:'30px' }}>
              <TourInquiries />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
      <Footer />
    </div>
    
  );
};

export default AdminPanel;
