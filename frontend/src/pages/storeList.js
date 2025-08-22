import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStores } from '../services/api';
// Remove the unused DataTable import
import SearchBar from '../components/searchBar';
import RatingStars from '../components/ratingStars';

const StoreListContainer = styled.div`
  padding: 20px 0;
`;

const StoreCard = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const StoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 15px;
  }
`;

const StoreInfo = styled.div`
  flex: 1;
`;

const StoreName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 10px;
`;

const StoreAddress = styled.p`
  color: ${props => props.theme.colors.gray};
  margin-bottom: 5px;
`;

const StoreEmail = styled.p`
  color: ${props => props.theme.colors.gray};
  font-size: 0.9rem;
`;

const StoreStats = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const AverageRating = styled.div`
  text-align: center;
`;

const RatingValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const RatingCount = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray};
`;

const UserRating = styled.div`
  text-align: center;
`;

const UserRatingLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 5px;
`;

const StoreList = ({ user }) => {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async (filters = {}, page = 1) => {
    try {
      setLoading(true);
      const data = await getStores({ ...filters, page });
      setStores(data.stores);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    fetchStores(filters);
  };

  if (loading) {
    return <div>Loading stores...</div>;
  }

  return (
    <StoreListContainer>
      <h1 className="page-title">Browse Stores</h1>

      <SearchBar 
        onSearch={handleSearch}
        filters={[
          { value: 'name', label: 'Name' },
          { value: 'address', label: 'Address' }
        ]}
        placeholder="Search stores by name or address..."
      />

      {stores.map(store => (
        <StoreCard key={store.id}>
          <StoreHeader>
            <StoreInfo>
              <StoreName>{store.name}</StoreName>
              <StoreAddress>{store.address}</StoreAddress>
              <StoreEmail>{store.email}</StoreEmail>
              {store.owner_name && <StoreEmail>Owner: {store.owner_name}</StoreEmail>}
            </StoreInfo>

            <StoreStats>
              <AverageRating>
                <RatingValue>{parseFloat(store.average_rating).toFixed(1)}</RatingValue>
                <RatingCount>{store.rating_count} ratings</RatingCount>
                <RatingStars 
                  rating={parseFloat(store.average_rating)} 
                  editable={false} 
                  showText={false}
                />
              </AverageRating>

              <UserRating>
                <UserRatingLabel>Your Rating:</UserRatingLabel>
                <RatingStars 
                  storeId={store.id}
                  userRating={store.user_rating}
                  editable={true}
                  showText={false}
                />
                {store.user_rating && (
                  <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '5px' }}>
                    {store.user_rating}/5
                  </div>
                )}
              </UserRating>
            </StoreStats>
          </StoreHeader>
        </StoreCard>
      ))}

      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <button 
            className="btn btn-secondary"
            disabled={pagination.page === 1}
            onClick={() => fetchStores({}, pagination.page - 1)}
            style={{ marginRight: '10px' }}
          >
            Previous
          </button>
          <span style={{ padding: '10px 20px', color: '#6c757d' }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button 
            className="btn btn-secondary"
            disabled={pagination.page === pagination.pages}
            onClick={() => fetchStores({}, pagination.page + 1)}
            style={{ marginLeft: '10px' }}
          >
            Next
          </button>
        </div>
      )}
    </StoreListContainer>
  );
};

export default StoreList;