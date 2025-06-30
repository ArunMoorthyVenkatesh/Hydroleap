import React, { useEffect, useState } from 'react';
import axios from 'axios';
import seaVideo from "../assets/sea_7.mp4";
import Header from './Header';

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          alert('No token found. Please log in again.');
          return;
        }

        const response = await axios.get('http://localhost:5001/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAdminData(response.data);
      } catch (error) {
        console.error('Error loading admin profile:', error);
        alert('Could not load admin profile');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <div style={styles.container}>
      <video autoPlay muted loop style={styles.video}>
        <source src={seaVideo} type="video/mp4" />
      </video>

      <div style={styles.overlay}>
        <Header />

        <div style={styles.card}>
          {loading ? (
            <div style={styles.loading}>Loading profile...</div>
          ) : !adminData ? (
            <div style={styles.error}>Failed to load profile.</div>
          ) : (
            <>
              <h2 style={styles.title}>Admin Profile</h2>
              <div style={styles.info}><span>Name:</span> {adminData.firstName} {adminData.middleName} {adminData.lastName}</div>
              <div style={styles.info}><span>Email:</span> {adminData.email}</div>
              <div style={styles.info}><span>DOB:</span> {adminData.dob}</div>
              <div style={styles.info}><span>Phone:</span> {adminData.phone}</div>
              <div style={styles.info}><span>Gender:</span> {adminData.gender}</div>
              <div style={styles.info}><span>Tenant ID:</span> {adminData.tenantId}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    fontFamily: 'Georgia, serif'
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    top: 0,
    left: 0,
    zIndex: 0
  },
  overlay: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    width: '100%',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    marginTop: '8rem',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '3rem 2.5rem',
    color: '#fff',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '550px',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '600',
    marginBottom: '2rem'
  },
  info: {
    fontSize: '1.2rem',
    marginBottom: '1.2rem',
    lineHeight: '1.6',
    textAlign: 'left'
  },
  loading: {
    fontSize: '1.2rem',
    color: '#ddd'
  },
  error: {
    fontSize: '1.2rem',
    color: 'salmon'
  }
};

export default AdminProfilePage;
