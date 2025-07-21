import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar/navbar';
import './login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
        redirect: 'follow',
      });
      const responseBody = await response.text();

      if (response.status === 200) {
        try {
          // Try parsing it as JSON (it might be a JSON object or something else)
          const data = JSON.parse(responseBody);

          if (data.token) {
            localStorage.setItem('authToken', data.token);
            setIsLoggedIn(true);
          } else {
            console.log('No token in response data');
          }
        } catch (err) {
          console.error('Failed to parse response as JSON', err);
        }
      } else if (response.status === 402) {
        throw new Error('The role needs to be Employee');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <Navbar />
      <div className='container'>
        <h1>Login</h1>
        <form className='login-form' onSubmit={handleLogin}>
          <div className='box'>
            <label>Email:</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='box'>
            <label>Password:</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className='error'>{error}</p>}
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
