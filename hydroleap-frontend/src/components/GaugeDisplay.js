import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';

const GaugeDisplay = ({ label, value, maxValue, unit }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{label}</h2>
      <ReactSpeedometer
        maxValue={maxValue}
        value={value}
        segments={10}
        needleColor="black"
        startColor="green"
        endColor="red"
        textColor="white"
        height={180}
        width={300}
        currentValueText={`\n\n\n\n \n\n\n\n\n\n \n\n ${value} ${unit || ''}`}
      />
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    backgroundColor: '#222',
    padding: '1rem',
    borderRadius: '12px',
    width: 'fit-content',
    margin: '1.5rem auto',
  },
  heading: {
    fontSize: '1.4rem', // Adjust this as needed
    marginBottom: '1rem',
  },
};

export default GaugeDisplay;
