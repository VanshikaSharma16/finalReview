import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px 0;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const WelcomeTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 10px;
`;

const WelcomeText = styled.p`
  color: ${props => props.theme.colors.gray};
  font-size: 1.1rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.gray};
  line-height: 1.6;
`;

const QuickActions = styled.div`
  margin-top: 40px;
  text-align: center;
`;

const ActionButton = styled.button`
  margin: 0 10px;
  padding: 12px 25px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const Dashboard = ({ user }) => {
  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome, {user.name}!</WelcomeTitle>
        <WelcomeText>
          You are logged in as a {user.role}. Here's what you can do on our platform.
        </WelcomeText>
      </WelcomeSection>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>⭐</FeatureIcon>
          <FeatureTitle>Rate Stores</FeatureTitle>
          <FeatureDescription>
            Browse through various stores and submit your ratings based on your experience.
            You can also update your ratings anytime.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🔍</FeatureIcon>
          <FeatureTitle>Search Stores</FeatureTitle>
          <FeatureDescription>
            Find stores by name or location. Filter and sort results to find exactly what you're looking for.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>👤</FeatureIcon>
          <FeatureTitle>Manage Profile</FeatureTitle>
          <FeatureDescription>
            Update your personal information and change your password to keep your account secure.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      <QuickActions>
        <ActionButton onClick={() => window.location.href = '/stores'}>
          Browse Stores
        </ActionButton>
        <ActionButton onClick={() => window.location.href = '/profile'}>
          Update Profile
        </ActionButton>
      </QuickActions>
    </DashboardContainer>
  );
};

export default Dashboard;