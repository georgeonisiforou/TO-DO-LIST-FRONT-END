import React from "react";
import styled from "styled-components";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

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

const NotCompletedIcon = styled(ImCheckboxUnchecked)`
  font-size: 1.5rem;
`;

const CompletedIcon = styled(ImCheckboxChecked)`
  font-size: 1.5rem;
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
    id: 0,
    text: "",
    isCompleted: false,
  });
  const [currentContent, setCurrentContent] = useState({
    id: 0,
    text: "",
    isCompleted: false,
  });
  const [todoText, setTodoText] = useState("");

  useEffect(() => {
    const getAllData = async () => {
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

    getSingleTodo();

    getAllData();
  }, [id]);

  const refetchData = async () => {
    setLoading(true);
    const todosData = await axios.get("http://localhost:3001/todoItems");
    setData(todosData.data);
    setLoading(false);
  };

  const addTodo = async () => {
    try {
      setLoading(true);
      const newTodos = await axios.post(
        "http://localhost:3001/todoItems",
        newTodo
      );
      refetchData();
      setLoading(false);
    } catch (err) {
      setErrorMessage(err.response?.data.details[0].message);
      console.log(errorMessage);
    }
  };

  const handleId = (event) => {
    setId(event.target.value);
  };

  const handleText = (event) => {
    setNewTodo({
      id: data.length + 1,
      text: event.target.value,
      isCompleted: false,
    });
  };

  const getText = (event) => {
    setTodoText(event.target.value);
  };

  const handleUpdate = (event) => {
    let todoToUpdate = data.filter((todo) => todo.text === todoText);

    setCurrentContent({
      id: todoToUpdate[0].id,
      text: event.target.value,
      isCompleted: todoToUpdate[0].isCompleted,
    });
  };

  const handleComplete = async (id, correctId) => {
    setLoading(true);

    const updatedTodo = await axios.put(
      `http://localhost:3001/todoItems/${correctId}`,
      {
        id: data[id].id,
        text: data[id].text,
        isCompleted: !data[id].isCompleted,
      }
    );
    setLoading(false);
  };

  const saveUpdate = async () => {
    try {
      setLoading(true);
      const updatedTodo = await axios.put(
        `http://localhost:3001/todoItems/${currentContent.id}`,
        currentContent
      );
      setLoading(false);
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
    refetchData();
    setLoading(false);
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
              refetchData();
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
                refetchData();
              }}
            >
              {single ? "Hide single to-do" : "Display single to-do"}
            </AddTodoBtn>
          </BtnLine>
        </BtnsContainer>
        <p style={{ color: "red" }}>{errorMessage}</p>

        <ListContainer>
          {/* {loading && <div>Loading</div>} */}
          {all
            ? data.map((item, idx) => {
                return (
                  <TodoContainer key={idx}>
                    <TodoTextContent onChange={handleUpdate} onClick={getText}>
                      {item.text}
                    </TodoTextContent>
                    <TodoId>{`ID: ${item.id}`}</TodoId>
                    <CompletedContainer>
                      Completed
                      {item.isCompleted ? (
                        <CompletedIcon
                          onClick={() => {
                            handleComplete(idx, item.id);
                            refetchData();
                          }}
                        />
                      ) : (
                        <NotCompletedIcon
                          onClick={() => {
                            handleComplete(idx, item.id);
                            refetchData();
                          }}
                        />
                      )}
                    </CompletedContainer>
                    <div style={{ display: "flex" }}>
                      <UpdateBtn onClick={() => saveUpdate()}>SAVE</UpdateBtn>
                      <DeleteBtn
                        onClick={() => {
                          deleteTodo(idx);
                          refetchData();
                        }}
                      >
                        DELETE
                      </DeleteBtn>
                    </div>
                  </TodoContainer>
                );
              })
            : null}

          {/* {loading && <div>Loading</div>} */}
          {single ? (
            singleTodo.length !== 0 ? (
              <TodoContainer>
                <TodoTextContent onChange={handleUpdate}>
                  {singleTodo[0].text}
                </TodoTextContent>
                <TodoId>{`ID: ${singleTodo[0].id}`}</TodoId>
                <CompletedContainer>
                  Completed
                  {isCompleted ? <CompletedIcon /> : <NotCompletedIcon />}
                </CompletedContainer>
                <div style={{ display: "flex" }}>
                  <UpdateBtn onClick={() => saveUpdate()}>SAVE</UpdateBtn>
                  <DeleteBtn
                    onClick={() => {
                      let idx = singleTodo[0].id - 1;
                      deleteTodo(idx);
                      setSingleTodo([]);
                      refetchData();
                    }}
                  >
                    DELETE
                  </DeleteBtn>
                </div>
              </TodoContainer>
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
