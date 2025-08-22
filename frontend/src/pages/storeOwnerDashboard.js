import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStoreOwnerDashboard } from '../services/api';
import DataTable from '../components/dataTable';
import RatingStars from '../components/ratingStars';

const StoreOwnerContainer = styled.div`
  padding: 20px 0;
`;

const StoresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
`;

const StoreCard = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const StoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const StoreName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 10px;
`;

const StoreAddress = styled.p`
  color: ${props => props.theme.colors.gray};
  margin-bottom: 15px;
`;

const StoreStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
`;

const Stat = styled.div`
  text-align: center;
  padding: 15px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const RecentRatings = styled.div`
  margin-top: 30px;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${props => props.theme.colors.lightGray};
`;

const StoreOwnerDashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState({ stores: [], recentRatings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getStoreOwnerDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const ratingColumns = [
    { 
      key: 'user_name', 
      title: 'User',
      render: (item) => <strong>{item.user_name}</strong>
    },
    { 
      key: 'rating', 
      title: 'Rating',
      render: (item) => <RatingStars rating={item.rating} editable={false} />
    },
    { 
      key: 'created_at', 
      title: 'Date',
      render: (item) => new Date(item.created_at).toLocaleDateString()
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <StoreOwnerContainer>
      <h1 className="page-title">Store Owner Dashboard</h1>

      <StoresGrid>
        {dashboardData.stores.map(store => (
          <StoreCard key={store.id}>
            <StoreHeader>
              <div>
                <StoreName>{store.name}</StoreName>
                <StoreAddress>{store.address}</StoreAddress>
                <StoreAddress>{store.email}</StoreAddress>
              </div>
            </StoreHeader>

            <StoreStats>
              <Stat>
                <StatLabel>Average Rating</StatLabel>
                <StatValue>{parseFloat(store.average_rating).toFixed(1)}/5</StatValue>
              </Stat>
              <Stat>
                <StatLabel>Total Ratings</StatLabel>
                <StatValue>{store.rating_count}</StatValue>
              </Stat>
            </StoreStats>

            <RatingStars 
              rating={parseFloat(store.average_rating)} 
              editable={false} 
              showText={false}
              size="large"
            />
          </StoreCard>
        ))}
      </StoresGrid>

      <RecentRatings>
        <SectionTitle>Recent Ratings</SectionTitle>
        <DataTable
          columns={ratingColumns}
          data={dashboardData.recentRatings}
          emptyMessage="No ratings yet"
        />
      </RecentRatings>
    </StoreOwnerContainer>
  );
};

export default StoreOwnerDashboard;