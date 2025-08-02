import React from 'react';
import './LoadingSpinner.css'; // import the styles

const LoadingSpinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner" />
    </div>
  );
};

export default LoadingSpinner;
