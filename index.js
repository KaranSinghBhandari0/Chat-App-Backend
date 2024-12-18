require('dotenv').config();
const express = require('express');
const connectDB = require('./lib/connectDB');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { app, server } = require('./lib/socket')

app.use(
	cors({
        // origin: "http://localhost:5173",
        origin: "https://chat-app-frontend-nine-rho.vercel.app",
        credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log("Listening on port " + PORT);
    connectDB();
});

app.get('/', (req, res) => {
    res.send('this is root');
});

// auth routes
app.use('/api/auth', require('./routes/auth'));

// chat routes
app.use('/api/messages', require('./routes/message'));