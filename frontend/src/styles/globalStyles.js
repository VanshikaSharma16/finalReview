import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.main};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.colors.primary};
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
    border: 1px solid ${props => props.theme.colors.lightGray};
    border-radius: 5px;
    padding: 10px 15px;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: ${props => props.theme.colors.primary};
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .card {
    background: ${props => props.theme.colors.white};
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 25px;
    margin-bottom: 25px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  }

  .btn {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 6px;
    font-weight: 600;
    text-align: center;
    transition: all 0.3s ease;
    
    &-primary {
      background: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.white};
      
      &:hover {
        background: ${props => props.theme.colors.secondary};
        transform: translateY(-2px);
      }
      
      &:disabled {
        background: ${props => props.theme.colors.gray};
        cursor: not-allowed;
        
        &:hover {
          transform: none;
        }
      }
    }
    
    &-secondary {
      background: ${props => props.theme.colors.lightGray};
      color: ${props => props.theme.colors.text};
      
      &:hover {
        background: ${props => props.theme.colors.gray};
        color: ${props => props.theme.colors.white};
      }
    }
    
    &-accent {
      background: ${props => props.theme.colors.accent};
      color: ${props => props.theme.colors.white};
      
      &:hover {
        background: ${props => props.theme.colors.purple};
      }
    }
    
    &-small {
      padding: 8px 16px;
      font-size: 0.9rem;
    }
  }

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: ${props => props.theme.colors.text};
    }

    input, select, textarea {
      width: 100%;
    }

    .error {
      color: #e74c3c;
      font-size: 0.9rem;
      margin-top: 5px;
    }
  }

  .page-title {
    font-size: 2.2rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 2px solid ${props => props.theme.colors.lightGray};
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
    color: white;
    padding: 25px;
    border-radius: 10px;
    text-align: center;
    
    h3 {
      font-size: 1.2rem;
      margin-bottom: 10px;
      opacity: 0.9;
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    .container {
      padding: 0 15px;
    }
    
    .card {
      padding: 15px;
    }
    
    .stats-container {
      grid-template-columns: 1fr;
    }
    
    .page-title {
      font-size: 1.8rem;
    }
  }
`;

export default GlobalStyles;