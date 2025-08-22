import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDashboardStats, getUsers, createUser, getStores } from '../services/api';
import DataTable from '../components/dataTable';
import SearchBar from '../components/searchBar';

const AdminContainer = styled.div`
  padding: 20px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  color: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 10px;
  opacity: 0.9;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
`;

const TabContainer = styled.div`
  margin-bottom: 20px;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 2px solid ${props => props.theme.colors.lightGray};
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 12px 25px;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : 'normal'};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  }
`;

const FormContainer = styled.div`
  background: ${props => props.theme.colors.white};
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
`;

const FormTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({ userCount: 0, storeCount: 0, ratingCount: 0 });
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userPagination, setUserPagination] = useState({});
  const [storePagination, setStorePagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async (filters = {}, page = 1) => {
    try {
      const data = await getUsers({ ...filters, page });
      setUsers(data.users);
      setUserPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStores = async (filters = {}, page = 1) => {
    try {
      const data = await getStores({ ...filters, page });
      setStores(data.stores);
      setStorePagination(data.pagination);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createUser(newUser);
      setNewUser({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
      });
      fetchUsers(); // Refresh the list
      alert('User created successfully!');
    } catch (error) {
      alert(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'address', title: 'Address', sortable: true },
    { key: 'role', title: 'Role', sortable: true },
    { 
      key: 'created_at', 
      title: 'Joined', 
      sortable: true,
      render: (item) => new Date(item.created_at).toLocaleDateString()
    }
  ];

  const storeColumns = [
    { key: 'name', title: 'Store Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'address', title: 'Address', sortable: true },
    { key: 'owner_name', title: 'Owner', sortable: true },
    { 
      key: 'average_rating', 
      title: 'Rating', 
      sortable: true,
      render: (item) => `${parseFloat(item.average_rating).toFixed(1)}/5 (${item.rating_count} ratings)`
    }
  ];

  return (
    <AdminContainer>
      <h1 className="page-title">Admin Dashboard</h1>

      <TabContainer>
        <TabButtons>
          <TabButton 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </TabButton>
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </TabButton>
          <TabButton 
            active={activeTab === 'stores'} 
            onClick={() => setActiveTab('stores')}
          >
            Stores
          </TabButton>
          <TabButton 
            active={activeTab === 'create'} 
            onClick={() => setActiveTab('create')}
          >
            Create User
          </TabButton>
        </TabButtons>

        {activeTab === 'stats' && (
          <>
            <StatsGrid>
              <StatCard>
                <StatTitle>Total Users</StatTitle>
                <StatValue>{stats.userCount}</StatValue>
              </StatCard>
              <StatCard>
                <StatTitle>Total Stores</StatTitle>
                <StatValue>{stats.storeCount}</StatValue>
              </StatCard>
              <StatCard>
                <StatTitle>Total Ratings</StatTitle>
                <StatValue>{stats.ratingCount}</StatValue>
              </StatCard>
            </StatsGrid>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <SearchBar 
              onSearch={(filters) => fetchUsers(filters)}
              filters={[
                { value: 'name', label: 'Name' },
                { value: 'email', label: 'Email' },
                { value: 'address', label: 'Address' },
                { value: 'role', label: 'Role' }
              ]}
              placeholder="Search users..."
            />
            <DataTable
              columns={userColumns}
              data={users}
              pagination={userPagination}
              onPageChange={(page) => fetchUsers({}, page)}
              onSort={(field, order) => fetchUsers({ sortBy: field, sortOrder: order })}
            />
          </>
        )}

        {activeTab === 'stores' && (
          <>
            <SearchBar 
              onSearch={(filters) => fetchStores(filters)}
              filters={[
                { value: 'name', label: 'Name' },
                { value: 'address', label: 'Address' }
              ]}
              placeholder="Search stores..."
            />
            <DataTable
              columns={storeColumns}
              data={stores}
              pagination={storePagination}
              onPageChange={(page) => fetchStores({}, page)}
              onSort={(field, order) => fetchStores({ sortBy: field, sortOrder: order })}
            />
          </>
        )}

        {activeTab === 'create' && (
          <FormContainer>
            <FormTitle>Create New User</FormTitle>
            <form onSubmit={handleCreateUser}>
              <FormRow>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    minLength="20"
                    maxLength="60"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
              </FormRow>

              <FormRow>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    minLength="8"
                    maxLength="16"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </FormRow>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={newUser.address}
                  onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                  maxLength="400"
                  rows="3"
                />
              </div>

              <FormActions>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('users')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </FormActions>
            </form>
          </FormContainer>
        )}
      </TabContainer>
    </AdminContainer>
  );
};

export default AdminDashboard;