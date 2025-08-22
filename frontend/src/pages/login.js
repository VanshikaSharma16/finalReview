import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { loginUser } from '../services/api';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  padding: 20px;
`;

const LoginForm = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border: 2px solid ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.gray};
    cursor: not-allowed;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 25px;
  color: ${props => props.theme.colors.gray};
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    
    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }
`;

const ErrorMessage = styled.div`
  background: #ffe6e6;
  color: #d32f2f;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #d32f2f;
`;

const DemoAccounts = styled.div`
  margin-top: 25px;
  padding: 15px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  font-size: 0.9rem;
  
  h4 {
    margin-bottom: 10px;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    margin: 5px 0;
    color: ${props => props.theme.colors.gray};
  }
`;

const DemoButton = styled.button`
  margin-right: 10px;
  margin-top: 10px;
  padding: 8px 15px;
  background: ${props => props.theme.colors.lightGray};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.theme.colors.gray};
    color: white;
  }
`;

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { token, user } = await loginUser({ email, password });
      onLogin(user, token);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // CHANGE THIS FUNCTION NAME - this is the fix
  const setDemoAccount = (demoEmail, demoPassword) => {
    setFormData({ email: demoEmail, password: demoPassword });
  };

  return (
    <LoginContainer>
      <LoginForm>
        <Title>Welcome Back</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={onSubmit}>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <RegisterLink>
          Don't have an account? <Link to="/register">Register here</Link>
        </RegisterLink>
        
        <DemoAccounts>
          <h4>Demo Accounts:</h4>
          <p>
            <strong>Admin:</strong> admin@example.com / admin123!
          </p>
          <p>
            <strong>Store Owner:</strong> owner@example.com / owner123!
          </p>
          <p>
            {/* UPDATE THESE FUNCTION CALLS TOO */}
            <DemoButton onClick={() => setDemoAccount('admin@example.com', 'admin123!')}>
              Use Admin
            </DemoButton>
            <DemoButton onClick={() => setDemoAccount('owner@example.com', 'owner123!')}>
              Use Store Owner
            </DemoButton>
          </p>
        </DemoAccounts>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;