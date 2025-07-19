import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  try {
    const payload = { userId: user._id || user }; 
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  } catch (error) {
    console.log('Error generating token:', error);
    return null;
  }
};
