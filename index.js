const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require(`cookie-parser`);
const connectDB = require('./config/db');
const logger = require('./middleware/logger.js');
const http = require('http');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const profileRoutes = require('./routes/./routes/profileRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);
const { authenticateSocket } = require('./middleware/authUser');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(logger);
app.use(cookieParser());

// Other middleware and routes
app.get('/', (req, res) => {
   res.send("WELCOME TO BRAVONET SOCIAL MEDIA SERVER")
})
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/profile', profileRoutes, uploadRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

// Socket.IO integration
io.use(authenticateSocket); // Authenticate user sockets


io.on('connection', (socket) => {
   console.log('New User connected');

   socket.on('disconnect', () => {
      console.log('User disconnected');
   });

io.on('connection', (socket) => {
   console.log('New User connected');

   socket.on('send-friend-request', (data) => {
      socket.broadcast.emit('friend-request', data);
   });
   socket.on('likePost', (data) => {
   socket.broadcast.emit('postLiked', data);
});

socket.on('commentPost', (data) => {
   socket.broadcast.emit('postCommented', data);
});

socket.on('sharePost', (data) => {
   socket.broadcast.emit('postShared', data);
});

   socket.on('disconnect', () => {
      console.log('User disconnected');
   });
});


});

// Start the server
server.listen(PORT, () => {
   console.log(`Server Socket is running on port ${PORT}`);
});
















