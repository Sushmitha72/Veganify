import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav
        className="navbar navbar-expand-lg px-5"
        style={{
          backgroundColor: '#ffffffcc',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ color: '#28a745', fontWeight: 700 }}>Veganify</h2>
        <div className="ms-auto">
          <a href="/register">
            <button
              style={{
                backgroundColor: '#f8f9fa',
                border: 'none',
                padding: '8px 20px',
                marginRight: '10px',
                borderRadius: '25px',
                color: '#28a745',
                fontWeight: 500,
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#28a745';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.color = '#28a745';
              }}
            >
              Register
            </button>
          </a>
          <a href="/login">
            <button
              style={{
                backgroundColor: '#28a745',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '25px',
                color: '#fff',
                fontWeight: 500,
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#218838';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#28a745';
              }}
            >
              Login
            </button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          backgroundImage: 'url("../bgpng.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '90vh',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', maxWidth: '800px', textShadow: '2px 2px 6px rgba(0,0,0,0.5)' }}>
          "Choose compassion, health, and sustainability. Veganify your life—because every meal is a chance to make a difference for the planet, the animals, and yourself."
        </h1>
        <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#e0e0e0' }}>
          Discover delicious vegan options and take charge of your food choices today.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
