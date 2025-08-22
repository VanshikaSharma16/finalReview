import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 15px 0;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.lightBlue};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.white};
  padding: 8px 15px;
  border-radius: 5px;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.theme.colors.purple};
  }
`;

const RoleBadge = styled.span`
  background: ${props => {
    switch (props.role) {
      case 'admin': return props.theme.colors.accent;
      case 'store_owner': return props.theme.colors.purple;
      default: return props.theme.colors.lightBlue;
    }
  }};
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (user.role) {
      case 'admin': return '/admin';
      case 'store_owner': return '/store-owner';
      default: return '/dashboard';
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to={getDashboardLink()}>RateMyStore</Logo>
        <Nav>
          <NavLink to={getDashboardLink()}>Dashboard</NavLink>
          <NavLink to="/stores">Stores</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          {(user.role === 'store_owner' || user.role === 'admin') && (
            <NavLink to="/store-owner">Store Owner</NavLink>
          )}
        </Nav>
        <UserInfo>
          <UserName>{user.name}</UserName>
          <RoleBadge role={user.role}>{user.role}</RoleBadge>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;