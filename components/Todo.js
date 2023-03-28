import React from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

const TodoContainer = styled.div`
  width: 250px;
  height: 400px;
  border-radius: 8px;
  background-color: var(--main-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const TodoTextContent = styled.textarea`
  flex: 3;
  background-color: var(--accent-color);
  padding: 1rem;
  border-radius: 8px;
  outline: none;
  resize: none;
  font: inherit;
  color: inherit;
`;

const UpdateBtn = styled.button`
  margin: 8px auto;
  height: 40px;
  color: inherit;
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  cursor: pointer;
  background-color: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    color: var(--hover-color);
  }
`;

const DeleteBtn = styled.button`
  margin: 8px auto;
  font-weight: 600;
  height: 40px;
  color: inherit;
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  cursor: pointer;
  background-color: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    color: var(--hover-color);
  }
`;

const TodoId = styled.p`
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
`;

const CompletedContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CompletedIcon = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  border: 0;
  position: relative;
  cursor: pointer;
`;

const Todo = ({ key, item, todos }) => {
  const [data, setData] = useState(todos);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [all, setAll] = useState(false);
  const [newTodo, setNewTodo] = useState({
    text: "",
  });
  const [currentContent, setCurrentContent] = useState(item);
  const [todoText, setTodoText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const todosData = await axios.get("http://localhost:3001/todoItems");
    setCurrentContent(todosData);
    setLoading(false);
  };

  const getText = (event) => {
    setTodoText(event.target.value);
    setErrorMessage("");
  };

  const handleUpdate = async (checked, todoId, todoText) => {
    try {
      setLoading(true);

      const updatedTodo = await axios.put(
        `http://localhost:3001/todoItems/${todoId}`,
        {
          id: todoId,
          text: todoText,
          isCompleted: checked,
        }
      );
      setLoading(false);
      setCurrentContent({
        id: todoId,
        text: todoText,
        isCompleted: checked,
      });
    } catch (err) {
      setErrorMessage(err.response?.data.details[0].message);
      setLoading(false);
      setAll(false);
    }
  };

  const saveUpdate = async () => {
    try {
      setLoading(true);
      const updatedTodo = await axios.put(
        `http://localhost:3001/todoItems/${currentContent.id}`,
        currentContent
      );
      setLoading(false);
      fetchData();
    } catch (err) {
      setErrorMessage(err.response?.data.details[0].message);
      setLoading(false);
      setAll(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    const deletedTodo = await axios.delete(
      `http://localhost:3001/todoItems/${id + 1}`
    );
    fetchData();
    setLoading(false);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", maxWidth: "250px" }}
    >
      <p>{errorMessage}</p>

      <TodoContainer>
        <TodoTextContent onChange={getText}>
          {currentContent.text}
        </TodoTextContent>

        <TodoId>{`ID: ${currentContent.id}`}</TodoId>
        <CompletedContainer>
          Completed
          <CompletedIcon
            defaultChecked={currentContent.isCompleted}
            onChange={(e) => {
              handleUpdate(
                e.target.checked,
                currentContent.id,
                currentContent.text
              );
            }}
          />
        </CompletedContainer>
        <div style={{ display: "flex" }}>
          <UpdateBtn
            onClick={() =>
              handleUpdate(
                currentContent.isCompleted,
                currentContent.id,
                todoText
              )
            }
          >
            SAVE
          </UpdateBtn>
          <DeleteBtn
            onClick={() => {
              deleteTodo(key);
              fetchData();
            }}
          >
            DELETE
          </DeleteBtn>
        </div>
      </TodoContainer>
    </div>
  );
};

export default Todo;
