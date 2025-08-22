const validateRegistration = (req, res, next) => {
  const { name, email, password, address } = req.body;
  
  if (!name || name.length < 20 || name.length > 60) {
    return res.status(400).json({ 
      message: 'Name is required and must be between 20-60 characters' 
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Valid email is required' 
    });
  }
  
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' 
    });
  }
  
  if (address && address.length > 400) {
    return res.status(400).json({ 
      message: 'Address must be less than 400 characters' 
    });
  }
  
  next();
};

const validateStore = (req, res, next) => {
  const { name, email, address } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Store name is required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }
  
  if (!address || address.trim().length === 0) {
    return res.status(400).json({ message: 'Address is required' });
  }
  
  next();
};

const validateRating = (req, res, next) => {
  const { rating } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateStore,
  validateRating
};