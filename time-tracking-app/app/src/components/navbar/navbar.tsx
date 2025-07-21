import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

interface User {
  id: string;
  email: string;
  name: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      fetch('http://localhost:3000/user', {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      })
        .then(response => {
          // Check if the response status is OK (200)
          if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status}`);
          }
          return response.json(); // Parse JSON only if the status is OK
        })
        .then(data => {
          if (data.id) {
            setIsLoggedIn(true);
            setUser(data); // Set user info
          }
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          setIsLoggedIn(false); // Handle as not logged in
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className='nav'>
      <a className='logo' href='/'>
        <h1>Time Tracking App</h1>
      </a>

      <div>
        {isLoggedIn ? (
          <div>
            {/* Display user email or name */}
            <button className='logout' onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        ) : (
          <a className='login' href='/login'>
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
