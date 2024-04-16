import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch'; // Used for making requests to the Yelp API
import { getExpenses, addExpense, deleteExpense, getUserProfile, updateUserProfile ,UserProfile } from './mongodb.js';
import { readFile } from 'fs/promises';
import User from './ UserModel.js';
import serviceAccount from './config/dinesaver-2df54-firebase-adminsdk-rj89c-d5d4f8baef.json' assert { type: 'json' };


import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';




dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  1
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


app.delete('/api/expenses/:id', async (req, res) => {
  console.log(`Delete request for expense with id: ${req.params.id}`); 
  try {
    console.log('Attempting to delete expense'); 
    const deletedExpense = await deleteExpense(req.params.id);
    if (!deletedExpense) {
      console.log('Expense not found'); 
      return res.status(404).json({ error: 'Expense not found' });
    }
    console.log('Expense deleted successfully'); 
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error); 
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/search', async (req, res) => {
  const { location, term } = req.query;
  const apiKey = process.env.YELP_API_KEY; 
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


app.put('/api/user/profile/:username', async (req, res) => {
  try {
  
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
function verifyToken(req, res, next) {

  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
  
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = authData;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

async function initializeFirebaseApp() {
 
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}


initializeFirebaseApp();
app.post('/api/login', async (req, res) => {
  try {
    
    const token = req.headers.authorization.split('Bearer ')[1];
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('User ID:', decodedToken.uid);
    const serverToken = jwt.sign(
      { uid: decodedToken.uid }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

  
    res.json({ token: serverToken });
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(401).send('Unauthorized: Invalid token');
  }
});







