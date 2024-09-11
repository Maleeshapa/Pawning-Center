import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Navigate based on accountType
      if (data.accountType === 'superadmin') {
        navigate('/Dashboard');
      } else if (data.accountType === 'admin') {
        navigate('/DashboardAdmin');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="login-form">
        <h2 className="text-center caption-login">Login</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="p-4">
              <form onSubmit={handleLogin}>
                <div className="form-com">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="text-box"
                    id="username"
                    placeholder="Type Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="form-com position-relative">
                  <label htmlFor="password">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'} 
                    className="text-box"
                    id="password"
                    placeholder="Type Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="show-password-btn mt-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <button type="submit" className="btnLog">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
