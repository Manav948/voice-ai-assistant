import User from '../models/user.js';
import { gemini } from '../gemini.js';
import moment from 'moment';

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);  
  } catch (error) {
    console.log('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const askToAssitant = async (req, res) => {
  try {
    const { command } = req.body;
    if (!command) {
      return res.status(400).json({ response: 'Command is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const assistantName = user.assistantName || 'Assistant';
    const userName = user.username || 'User';

    const result = await gemini(command, assistantName, userName);
    const cleanResult = result.replace(/```json|```/g, '').trim();

    let gemResult;
    try {
      gemResult = JSON.parse(cleanResult);
    } catch {
      return res.status(400).json({ response: "Sorry, I can't understand" });
    }

    const { type, userInput, response } = gemResult;

    switch (type) {
      case 'get_date':
        return res.json({
          type,
          userInput,
          response: `current date is ${moment().format('YYYY-MM-DD')}`,
        });

      case 'get_time':
        return res.json({
          type,
          userInput,
          response: `current time is ${moment().format('hh:mm A')}`,
        });

      case 'get_day':
        return res.json({
          type,
          userInput,
          response: `today is ${moment().format('dddd')}`,
        });

      case 'get_month':
        return res.json({
          type,
          userInput,
          response: `current month is ${moment().format('MMMM')}`,
        });

      case 'general':
      case 'google_search':
      case 'youtube_search':
      case 'youtube_play':
      case 'facebook_open':
      case 'instagram_open':
      case 'weather_show':
      case 'calculator_open':
        return res.status(200).json({ type, userInput, response });

      default:
        return res.status(400).json({ response: "sorry, I can't understand" });
    }
  } catch (error) {
    console.error('Error in askToAssitant:', error);
    return res.status(500).json({ response: 'Internal server error' });
  }
};
