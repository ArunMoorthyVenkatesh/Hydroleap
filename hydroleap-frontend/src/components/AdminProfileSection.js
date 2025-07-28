import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

const AdminProfileSection = () => {
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
        const response = await axios.get(`${API_BASE}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdminData(response.data);
      } catch (error) {
        setAdminData(null);
        alert('Could not load admin profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  if (!adminData) {
    return <div style={styles.error}>Failed to load profile.</div>;
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Admin Profile</h2>
      <div style={styles.info}><span>Name:</span> {adminData.firstName} {adminData.middleName} {adminData.lastName}</div>
      <div style={styles.info}><span>Email:</span> {adminData.email}</div>
      <div style={styles.info}><span>DOB:</span> {adminData.dob}</div>
      <div style={styles.info}><span>Phone:</span> {adminData.phone}</div>
      <div style={styles.info}><span>Gender:</span> {adminData.gender}</div>
      <div style={styles.info}><span>Tenant ID:</span> {adminData.tenantId}</div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '3rem 2.5rem',
    color: '#222',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.10)',
    width: '100%',
    maxWidth: '550px',
    textAlign: 'center',
    margin: '0 auto'
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '600',
    marginBottom: '2rem',
    color: '#23c1b5'
  },
  info: {
    fontSize: '1.1rem',
    marginBottom: '1.2rem',
    lineHeight: '1.6',
    textAlign: 'left'
  },
  loading: {
    fontSize: '1.2rem',
    color: '#999',
    textAlign: 'center',
    padding: '2rem'
  },
  error: {
    fontSize: '1.2rem',
    color: 'salmon',
    textAlign: 'center',
    padding: '2rem'
  }
};

export default AdminProfileSection;
