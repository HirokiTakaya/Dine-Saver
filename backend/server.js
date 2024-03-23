import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch'; // Used for making requests to the Yelp API
import { getExpenses, addExpense, deleteExpense, getUserProfile, updateUserProfile ,UserProfile } from './mongodb.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await getExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const newExpense = await addExpense(req.body);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
  console.log(`Delete request for expense with id: ${req.params.id}`); // Logging request parameters
  try {
    console.log('Attempting to delete expense'); // Logging before delete operation
    const deletedExpense = await deleteExpense(req.params.id);
    if (!deletedExpense) {
      console.log('Expense not found'); // Logging if attempted to delete but not found
      return res.status(404).json({ error: 'Expense not found' });
    }
    console.log('Expense deleted successfully'); // Logging if deletion is successful
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error); // Error logging
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to search for restaurant data from Yelp API
app.get('/api/search', async (req, res) => {
  const { location, term } = req.query;
  const apiKey = process.env.YELP_API_KEY; // Getting Yelp API key from .env file
  const yelpURL = `https://api.yelp.com/v3/businesses/search?location=${encodeURIComponent(location)}&term=${encodeURIComponent(term)}`;

  try {
    const yelpResponse = await fetch(yelpURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!yelpResponse.ok) {
      throw new Error('Failed to fetch from Yelp API');
    }

    const yelpData = await yelpResponse.json();
    res.json(yelpData);
  } catch (error) {
    console.error('Yelp API error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Endpoint to get user profile
app.get('/api/user/profile/:username', async (req, res) => {
  try {
    const userProfile = await getUserProfile(req.params.username);
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json(userProfile);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to update user profile
app.put('/api/user/profile/:username', async (req, res) => {
  try {
    // Handle password if there's an update including password
    const updatedUserProfile = await updateUserProfile(req.params.username, req.body);
    res.json(updatedUserProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


const createNewUserProfile = async (profileData) => {
  try {

    const newUserProfile = new UserProfile(profileData);
   
    await newUserProfile.save();
    return newUserProfile;
  } catch (error) {
    console.error('Error creating new user profile:', error);
    throw error;
  }
};

app.post('/api/user/profile', async (req, res) => {
  try {
    const newProfileData = req.body;
    const newProfile = await createNewUserProfile(newProfileData);
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating new user profile:', error);
    res.status(500).json({ error: error.message });
  }
});
