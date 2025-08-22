import React, { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 5px;
  background: white;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.theme.colors.lightGray};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.gray};
    color: white;
  }
`;

const SearchBar = ({ onSearch, filters = [], placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(filters[0]?.value || '');

  const handleSearch = () => {
    onSearch({
      search: searchTerm,
      filter: selectedFilter
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedFilter(filters[0]?.value || '');
    onSearch({
      search: '',
      filter: filters[0]?.value || ''
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      
      {filters.length > 0 && (
        <FilterSelect
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </FilterSelect>
      )}
      
      <SearchButton onClick={handleSearch}>Search</SearchButton>
      <ResetButton onClick={handleReset}>Reset</ResetButton>
    </SearchContainer>
  );
};

export default SearchBar;