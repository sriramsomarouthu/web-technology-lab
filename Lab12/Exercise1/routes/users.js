const express = require('express');
const router = express.Router();

// Sample data
let users = [
    { id: 1, name: 'sriram' },
    { id: 2, name: 'ramu' }
];

// GET all users
router.get('/', (req, res) => {
    res.json(users);
});

// GET single user (Route Parameter)
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.json(user);
});

// POST (Create user)
router.post('/', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.json(newUser);
});

// PUT (Update user)
router.put('/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    user.name = req.body.name;
    res.json(user);
});

// DELETE user
router.delete('/:id', (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    res.send('User deleted');
});

module.exports = router;