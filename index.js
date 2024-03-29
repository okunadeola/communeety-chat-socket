import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// const corsConfig = {
//   origin: '',
//   // credentials: true,
//   methods: ['GET', 'POST',]
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))



// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  

  // Allow certain headers to be sent
  // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // Allow certain HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});




const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send('Socket Server is Live');
});




let users = [];

const addUser = (userId, socketId) => {
  // ================== met 3 ====================
  const val = users?.filter((el) => el.userId !== userId);

  users = [...val, { userId, socketId }];

  // ================== met 3 ====================



  // ============ met 2 ============
  // let values = [...users];
  // const index = values.findIndex((data) => data?.userId === userId);

  // if (index !== -1) {
  //     values.splice(index, 1);
  //     values.push({ userId, socketId });
  //     users = [...values]
  // }else{
  //     users.push({ userId, socketId });
  // }
  // ============ met 2 ============




  // =============met 1===============
  //   !users.some((user) => user.userId === userId) &&
  //     users.push({ userId, socketId });
  // =============met 1===============

};

// const addUser = (userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
// };



const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};



// console.log(io)

io.on("connection", (socket) => {



  //when ceonnect
  console.log("a user connected.");





  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
   // console.log("added user", users);
    io.emit("getUsers", users);
  });




  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, messageObj }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      messageObj,
    });
  });


  //send and get typing...
  socket.on("sendTyping", ({ senderId, receiverId }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getTyping", {
      senderId
    });
  });






//rooms
//   socket.on("join", ({ name, room }, callBack) => {
//     // const { user, error } = addUserToRoom({ id: socket.id, name, room });

//     if (error) return callBack(error);

//     socket.join(user.room);
//   });




//   socket.on("sendGroupMessage", ({ message, room }) => {
//     io.to(room).emit("groupMessage", {
//       user: message.senderId,
//       msg: message,
//     });
//   });

//   socket.on("welcome", ({ user, room }) => {
//     socket.broadcast
//       .to(room)
//       .emit("message", { user: "Admin", text: `${user} has joined!` });
//   });




  //when disconnect
  socket.on("disconnect", () => {
      // console.log("a user disconnected!", users);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });




});






httpServer.listen(PORT, () => {
  console.log("API working! on port: " + PORT);
});
