import React from 'react';

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Navigation button box
  const navItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e9f7ef',
    borderRadius: '12px',
    padding: '10px 15px',
    marginBottom: '15px',
    color: '#155724',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  };

  const navItemHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#d4edda';
  };

  const navItemOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#e9f7ef';
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '10px',
    fontSize: '1.2rem'
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: '230px',
          backgroundColor: '#ffffff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          padding: '30px 20px',
          borderTopRightRadius: '20px',
          borderBottomRightRadius: '20px'
        }}
      >
        <h3 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '40px' }}>🌿 Veganify</h3>
        
         <a
          href="/check-dish"
          style={navItemStyle}
          onMouseOver={navItemHover}
          onMouseOut={navItemOut}
        >
          <span style={iconStyle}>🔍</span> Check Dish
        </a>

        
        <a
          href="/recipe"
          style={navItemStyle}
          onMouseOver={navItemHover}
          onMouseOut={navItemOut}
        >
          <span style={iconStyle}>🍲</span> Recipe Recommender
        </a>

        <a
          href="/profile"
          style={navItemStyle}
          onMouseOver={navItemHover}
          onMouseOut={navItemOut}
        >
          <span style={iconStyle}>👤</span> View Profile
        </a>

        <a
          href="/history"
          style={navItemStyle}
          onMouseOver={navItemHover}
          onMouseOut={navItemOut}
        >
          <span style={iconStyle}>📜</span> View History
        </a>

        <a
          href="#logout"
          onClick={handleLogout}
          style={{
            ...navItemStyle,
            backgroundColor: '#f8d7da',
            color: '#721c24'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f5c6cb')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f8d7da')}
        >
          <span style={iconStyle}>🔓</span> Logout
        </a>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px', flexGrow: 1 }}>
        <h2 style={{ color: '#333' }}>
          Welcome, <span style={{ color: '#28a745' }}>{user.userName || 'User'}</span>! 👋
        </h2>
        <p style={{ color: '#555', marginTop: '10px' }}>
          Let's make mindful food choices together. Explore dishes, check ingredients, and track your vegan journey.
        </p>

        <div
          style={{
            marginTop: '50px',
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <h4 style={{ color: '#28a745' }}>Start Exploring!</h4>
          <p style={{ color: '#666', maxWidth: '600px', margin: 'auto' }}>
            Use the "Check Dish" option to upload an image of any dish and find out if it's vegan or not using our AI classifier.
          </p>
          <a href="/check-dish">
            <button
              style={{
                marginTop: '20px',
                padding: '10px 30px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
            >
              🍽️ Check a Dish
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
