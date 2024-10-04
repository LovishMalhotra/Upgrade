// routes/userRoutes.js
const express = require('express');
const User = require('../model/User'); // Adjust the path to your User model
const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: 'User created successfully!', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
});


// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user', error });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare the provided password with the stored password (not secure)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Successful login, return user details (excluding password)
        res.status(200).json({
            message: 'Login successful!',
            user: {
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
