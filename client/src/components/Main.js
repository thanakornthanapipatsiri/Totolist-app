import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import Nav from "./Nav";

function Main({ socket }) {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [clientCount, setClientCount] = useState(0);

  const toggleModal = (itemId, createdBy) => {
    socket.emit("viewComments", itemId);
    setSelectedItemID(itemId);
    setCreatedBy(createdBy);
    setShowModal(!showModal);
  };

  const generateID = () => Math.random().toString(36).substring(2, 10);

  const handleAddTodo = (e) => {
    e.preventDefault();
    const createdBy = localStorage.getItem("_username");
    socket.emit("addTodo", {
      id: generateID(),
      todo,
      comments: [],
      createdBy,
    });
    setTodo("");
  };

  useEffect(() => {
    function fetchTodos() {
      fetch("http://localhost:4000/api")
        .then((res) => res.json())
        .then((data) => setTodoList(data))
        .catch((err) => console.error(err));
    }
    fetchTodos();
    socket.on("todos", (data) => setTodoList(data));

    // Listen for client count updates
    socket.on("connect", () => {
      setClientCount(socket.engine.clientsCount);
    });
    socket.on("disconnect", () => {
      setClientCount(socket.engine.clientsCount);
    });
  }, [socket]);

  const deleteTodo = (id) => socket.emit("deleteTodo", id);

  return (
    <div style={{ 
      backgroundImage: "url('https://cdn2.vectorstock.com/i/1000x1000/32/26/light-white-gray-texture-background-digital-vector-28503226.jpg')", 
      height: "100vh",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Nav />
      <form className="form" onSubmit={handleAddTodo}>
        <input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="input"
          required
        />
        <button className="form__cta">ADD</button>
        <Link to="/">
          <button className="form__ctb" style={{marginLeft: '10px'}}>RETURN</button>
        </Link>
      </form>

      <div className="todo__container">
        {todoList.map((item) => (
          <div className="todo__item" key={item.id}>
            <p>{item.todo}</p>
            <p>Created by: {item.createdBy}</p>
            <div>
              <button
                className="commentsBtn"
                onClick={() => toggleModal(item.id, item.createdBy)}
              >
                View Comments
              </button>

              <button className="deleteBtn" onClick={() => deleteTodo(item.id)}>
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          socket={socket}
          setShowModal={setShowModal}
          selectedItemID={selectedItemID}
          createdBy={createdBy}
        />
      )}
      <p style={{ textAlign: "center" }}>
        Currently {clientCount} user{clientCount !== 1 && "s"} online
      </p>
    </div>
  );
}

export default Main;
