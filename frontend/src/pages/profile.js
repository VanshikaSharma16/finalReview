import React, { useState } from 'react';
import styled from 'styled-components';
import { updatePassword } from '../services/api';

const ProfileContainer = styled.div`
  padding: 20px 0;
  max-width: 600px;
  margin: 0 auto;
`;

const ProfileCard = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const ProfileTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 10px;
`;

const ProfileRole = styled.span`
  background: ${props => {
    switch (props.role) {
      case 'admin': return props.theme.colors.accent;
      case 'store_owner': return props.theme.colors.purple;
      default: return props.theme.colors.primary;
    }
  }};
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ProfileInfo = styled.div`
  margin-bottom: 30px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const InfoValue = styled.span`
  color: ${props => props.theme.colors.gray};
`;

const PasswordForm = styled.form`
  background: ${props => props.theme.colors.background};
  padding: 25px;
  border-radius: 8px;
  margin-top: 30px;
`;

const FormTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;
`;

const Profile = ({ user }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileTitle>User Profile</ProfileTitle>
          <ProfileRole role={user.role}>{user.role}</ProfileRole>
        </ProfileHeader>

        <ProfileInfo>
          <InfoItem>
            <InfoLabel>Name:</InfoLabel>
            <InfoValue>{user.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Address:</InfoLabel>
            <InfoValue>{user.address || 'Not provided'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Member since:</InfoLabel>
            <InfoValue>{new Date(user.created_at).toLocaleDateString()}</InfoValue>
          </InfoItem>
        </ProfileInfo>

        <PasswordForm onSubmit={handlePasswordSubmit}>
          <FormTitle>Change Password</FormTitle>

          {message.text && (
            <div style={{
              background: message.type === 'success' ? '#e8f5e8' : '#ffe6e6',
              color: message.type === 'success' ? '#2e7d32' : '#d32f2f',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              borderLeft: `4px solid ${message.type === 'success' ? '#2e7d32' : '#d32f2f'}`
            }}>
              {message.text}
            </div>
          )}

          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              minLength="8"
              maxLength="16"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </PasswordForm>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;