import React, { useState } from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: ${props => props.theme.colors.white};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const TableHead = styled.thead`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  user-select: none;
  
  &:hover {
    background: ${props => props.sortable ? props.theme.colors.secondary : ''};
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  
  &:nth-child(even) {
    background: ${props => props.theme.colors.background};
  }
  
  &:hover {
    background: ${props => props.theme.colors.lightGray};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  vertical-align: middle;
`;

const SortIcon = styled.span`
  margin-left: 5px;
  font-size: 0.8rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid ${props => props.theme.colors.lightGray};
  background: ${props => props.theme.colors.background};
`;

const PageInfo = styled.span`
  color: ${props => props.theme.colors.gray};
`;

const PageButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  background: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${props => props.theme.colors.gray};
`;

const DataTable = ({
  columns,
  data,
  pagination,
  onPageChange,
  onSort,
  emptyMessage = "No data available"
}) => {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (!onSort) return;
    
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
    onSort(field, newSortOrder);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (!data || data.length === 0) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableHeader
                key={column.key}
                sortable={column.sortable}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                {column.title}
                {column.sortable && <SortIcon>{renderSortIcon(column.key)}</SortIcon>}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <tbody>
          {data.map((item, index) => (
            <TableRow key={item.id || index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(item) : item[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
      
      {pagination && (
        <Pagination>
          <PageInfo>
            Showing {pagination.page} of {pagination.pages} pages
            {pagination.total && ` (${pagination.total} total items)`}
          </PageInfo>
          <PageButtons>
            <PageButton
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Previous
            </PageButton>
            <PageButton
              disabled={pagination.page === pagination.pages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Next
            </PageButton>
          </PageButtons>
        </Pagination>
      )}
    </TableContainer>
  );
};

export default DataTable;