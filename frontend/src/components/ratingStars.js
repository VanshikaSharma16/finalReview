import React, { useState } from 'react';
import styled from 'styled-components';
import { submitRating } from '../services/api';

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Star = styled.span`
  font-size: 1.5rem;
  color: ${props => props.filled ? props.theme.colors.warning : props.theme.colors.lightGray};
  cursor: ${props => props.editable ? 'pointer' : 'default'};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.editable ? props.theme.colors.warning : ''};
  }
`;

const RatingText = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray};
`;

const RatingStars = ({ storeId, userRating, editable = true, showText = true, size = 'medium' }) => {
  const [currentRating, setCurrentRating] = useState(userRating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = async (rating) => {
    if (!editable) return;
    
    try {
      setCurrentRating(rating);
      await submitRating({ store_id: storeId, rating });
    } catch (error) {
      console.error('Error submitting rating:', error);
      setCurrentRating(userRating); // Revert on error
    }
  };

  const starSize = {
    small: '1.2rem',
    medium: '1.5rem',
    large: '2rem'
  }[size];

  return (
    <StarsContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          filled={star <= (hoverRating || currentRating)}
          editable={editable}
          style={{ fontSize: starSize }}
          onClick={() => handleRating(star)}
          onMouseEnter={() => editable && setHoverRating(star)}
          onMouseLeave={() => editable && setHoverRating(0)}
        >
          ★
        </Star>
      ))}
      {showText && (
        <RatingText>
          {currentRating > 0 ? `${currentRating}/5` : 'Not rated yet'}
        </RatingText>
      )}
    </StarsContainer>
  );
};

export default RatingStars;