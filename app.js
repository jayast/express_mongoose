const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://127.0.0.1:27017/userdemo')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', async (req, res) => {
    try {
        await User.create(req.body);
        res.redirect('/users');
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send('Error: Email already exists.');
        }
        res.status(400).send(err.message);
    }
});


app.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('users', { users });
});
app.get('/update/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('update', { user });
});

app.post('/update/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/users');
});

app.listen(3000)
