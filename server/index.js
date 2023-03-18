const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const PORT = 4000;

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let todoList = [];

socketIO.on("connection", (socket) => {
  console.log(`New Client: ${socket.id} just connected!`);

  socket.on("addTodo", (todo) => {
    todoList.unshift(todo);
    socket.emit("todos", todoList);
  });

  socket.on("viewComments", (id) => {
    for (let i = 0; i < todoList.length; i++) {
      if (id === todoList[i].id) {
        socket.emit("commentsReceived", todoList[i]);
      }
    }
  });

  socket.on("updateComment", (data) => {
    const { user, todoID, comment } = data;
    for (let i = 0; i < todoList.length; i++) {
      if (todoID === todoList[i].id) {
        todoList[i].comments.push({ name: user, text: comment });
        socket.emit("commentsReceived", todoList[i]);
      }
    }
  });

  socket.on("deleteTodo", (id) => {
    todoList = todoList.filter((todo) => todo.id !== id);
    socket.emit("todos", todoList);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected Client: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api", (req, res) => {
  res.json(todoList);
});

http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
