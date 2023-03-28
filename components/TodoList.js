import React from "react";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Todo from "./Todo";

const Title = styled.h1``;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const NewTodo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 600px;
  height: 300px;
  gap: 1rem;
`;

const TodoText = styled.textarea`
  width: 100%;
  height: 100px;
  resize: none;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 1rem;
  background-color: var(--main-color);
  color: var(--text-color);
  border: none;
  outline: none;
  font: inherit;
`;

const AddTodoBtn = styled.button`
  height: 50px;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  padding: 1rem;
  background-color: var(--accent-color);
  color: var(--text-color);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--hover-color);
  }
`;

const BtnLine = styled.div`
  display: flex;
  gap: 1rem;
  height: 50px;
`;

const IdInput = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  border-radius: 8px;
  background-color: var(--main-color);
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
  padding: 0.5rem;
`;

const BtnsContainer = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  margin: 2rem;
`;

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: 2rem;
  gap: 1rem;
`;

const TodoList = () => {
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [singleTodo, setSingleTodo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setCompleted] = useState(false);
  const [all, setAll] = useState(false);
  const [single, setSingle] = useState(false);
  const [id, setId] = useState(1);
  const [newTodo, setNewTodo] = useState({
    text: "",
  });
  const [currentContent, setCurrentContent] = useState({
    text: "",
    isCompleted: false,
  });
  const [todoText, setTodoText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const todosData = await axios.get("http://localhost:3001/todoItems");
    setData(todosData.data);
    setLoading(false);
  };

  const getSingleTodo = async () => {
    setLoading(true);
    const todoData = await axios.get(`http://localhost:3001/todoItems/${id}`);
    setSingleTodo(todoData.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const addTodo = async () => {
    try {
      setLoading(true);
      const newTodos = await axios.post(
        "http://localhost:3001/todoItems",
        newTodo
      );
      fetchData();
    } catch (err) {
      setErrorMessage(err.response?.data.details[0].message);
      console.log(errorMessage);
    }
    setLoading(false);
  };

  const handleId = (event) => {
    setId(event.target.value);
  };

  const handleText = (event) => {
    setNewTodo({
      text: event.target.value,
    });
  };

  return (
    <>
      <Container>
        <Title>To-Do List</Title>
        <NewTodo>
          <h2>Add a new to-do</h2>
          <TodoText placeholder="Add your text here..." onChange={handleText} />
          <AddTodoBtn onClick={() => addTodo()}>Save</AddTodoBtn>
        </NewTodo>
        <BtnsContainer>
          <AddTodoBtn
            onClick={() => {
              setAll(!all);
              setSingle(false);
              fetchData();
              setErrorMessage("");
            }}
          >
            {all ? "Hide all" : "Display all"}
          </AddTodoBtn>
          <BtnLine>
            <p>Enter ID</p>
            <IdInput placeholder="Enter to-do ID" onChange={handleId} />
          </BtnLine>

          <BtnLine>
            <AddTodoBtn
              onClick={() => {
                setSingle(!single);
                setAll(false);
                getSingleTodo();
                fetchData();
              }}
            >
              {single ? "Hide single to-do" : "Display single to-do"}
            </AddTodoBtn>
          </BtnLine>
        </BtnsContainer>
        <p style={{ color: "red" }}>{errorMessage}</p>

        <ListContainer>
          {all
            ? data.map((item, map_idx) => {
                return <Todo key={map_idx} item={item} todos={data} />;
              })
            : null}

          {single ? (
            singleTodo.length !== 0 ? (
              <Todo item={singleTodo[0]} />
            ) : (
              "No item to show"
            )
          ) : null}
        </ListContainer>
      </Container>
    </>
  );
};

export default TodoList;
