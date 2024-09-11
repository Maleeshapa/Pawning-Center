import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedAccountTypes }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/protected', {
          method: 'GET',
          credentials: 'include', 
        });

        if (!response.ok) {
          navigate('/Login');
          return;
        }

        const data = await response.json();
        const { accountType } = data;

        // Redirect based on account types
        if (!allowedAccountTypes.includes(accountType)) {
          navigate('/Login'); // Or a different page 
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/Login');
      }
    };

    checkAuth();
  }, [navigate, allowedAccountTypes]);

  return children;
};

export default ProtectedRoute;
