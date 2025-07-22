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
        return res.status(200).json({
          type,
          userInput,
          response: `Here is the information you requested: ${response}`,
        });

      case 'google_search':
        return res.status(200).json({
          type,
          userInput,
          response: `Searching for "${userInput}"...`,
          url: `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        });

      case 'youtube_play':
        return res.status(200).json({
          type,
          userInput,
          response: `Searching for "${userInput}"...`,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
        });

      case 'youtube_open':
        return res.status(200).json({
          type,
          userInput,
          response: 'Opening YouTube...',
          url: 'https://www.youtube.com',
        });

      case 'facebook_open':
        return res.status(200).json({
          type,
          userInput,
          response: 'Opening Facebook...',
          url: 'https://www.facebook.com',
        });

      case 'instagram_open':
        return res.status(200).json({
          type,
          userInput,
          response: 'Opening Instagram...',
          url: 'https://www.instagram.com',
        });

      case 'weather_show':
        return res.status(200).json({
          type,
          userInput,
          response: 'Showing weather information...',
          url: 'https://www.weather.com',
        });

      case 'calculator_open':
        return res.status(200).json({
          type,
          userInput,
          response: 'Opening calculator...',
          url: 'https://www.google.com/search?q=calculator',
        });
      default:
        return res.status(400).json({ response: "sorry, I can't understand" });
    }
  } catch (error) {
    console.error('Error in askToAssitant:', error);
    return res.status(500).json({ response: 'Internal server error' });
  }
};
