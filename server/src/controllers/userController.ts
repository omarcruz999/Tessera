/*
    Logic to retreive and update user data in Firestore
*/

import { RequestHandler } from 'express';
import { db } from '../services/firebase';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

export const getUserProfile: RequestHandler =  async (req, res) => {
    console.log('GET user profile for ID:', req.params.id);
    try {
        const userId = req.params.id;
        // Get user data from Firestore
        const userRef = doc(db, 'users', userId);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            res.status(404).json({ error: 'User not found' });
        }
        
        // Return user data
        res.status(200).json(snap.data());
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateUserProfile: RequestHandler = async (req, res) => {   
    try {
        const userId = req.params.id;
        const updateData = req.body;    // e.g. { name, avatarUrl, etc. }

        // Update user data in firestore
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, updateData);

        res.status(200).json({ message: 'User data updated successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deleteUserProfile: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.id;

        // Delete user data from Firestore
        const userRef = doc(db, 'users', userId);
        await deleteDoc(userRef);

        res.status(200).json({ message: 'User data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};