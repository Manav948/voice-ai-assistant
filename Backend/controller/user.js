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

export const saveAssitantPrefs = async (req, res) => {
  try {
    const { assistantName, assistantAvatar } = req.body;
    if (!assistantName || !assistantAvatar) {
      return res.status(400).json({ message: "assistantName & assistantAvatar required" })
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantAvatar },
      { new: true, select: "-password -__v" }
    );
    if (!user) {
      return res.status(404).json({ message: "Avatar not Found" });
    }
    return res.status(200).json({
      message: "Assistant Saved",
      user
    });
  } catch (error) {
    console.log("Error in saveAssistant Function : ", error);
    return res.status(500).json({ message: "Internal Server Error" });
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

    const { type, userinput, response } = gemResult;
    const inputText = userinput || command; // fallback if undefined

    switch (type) {
      case 'get_date':
        return res.json({
          type,
          userInput: inputText,
          response: `Current date is ${moment().format('YYYY-MM-DD')}`,
        });

      case 'get_time':
        return res.json({
          type,
          userInput: inputText,
          response: `Current time is ${moment().format('hh:mm A')}`,
        });

      case 'get_day':
        return res.json({
          type,
          userInput: inputText,
          response: `Today is ${moment().format('dddd')}`,
        });

      case 'get_month':
        return res.json({
          type,
          userInput: inputText,
          response: `Current month is ${moment().format('MMMM')}`,
        });

      case 'general':
        return res.status(200).json({
          type,
          userInput: inputText,
          response: response || "Here’s what I found.",
        });

      case 'google_search':
        return res.status(200).json({
          type,
          userInput: inputText,
          response: `Searching for "${inputText}"...`,
          url: `https://www.google.com/search?q=${encodeURIComponent(inputText)}`,
        });

      case 'youtube_open':
        return res.status(200).json({
          type,
          userInput: inputText,
          response: 'Opening YouTube...',
          url: 'https://www.youtube.com',
        });

      case 'facebook_open':
        return res.status(200).json({
          type,
          userInput: inputText,
          response: 'Opening Facebook...',
          url: 'https://www.facebook.com',
        });

      case 'instagram_open':
        return res.status(200).json({
          type,
          userInput: inputText,
          response: 'Opening Instagram...',
          url: 'https://www.instagram.com',
        });

      case 'weather_show':
        return res.status(200).json({
          type,
          userInput: inputText,
          response: 'Showing weather information...',
          url: 'https://www.weather.com',
        });

      case 'calculator_open':
        return res.status(200).json({
          type,
          userInput: inputText,
          response: 'Opening calculator...',
          url: 'https://www.google.com/search?q=calculator',
        });

      default:
        return res.status(400).json({ response: "Sorry, I can't understand" });
    }
  } catch (error) {
    console.error('Error in askToAssitant:', error);
    return res.status(500).json({ response: 'Internal server error' });
  }
};
