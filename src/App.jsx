import React, { useEffect, useState } from 'react'
import TodoList from './components/TodoList'
import TodoInputs from './components/TodoInputs'

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [todoValue, setTodoValue] = useState('');

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodos = (newTodo) => {
    if (!newTodo.trim()) return;
    setTodos((prevs) => [...prevs, { text: newTodo, completed: false }]);
    setTodoValue('');
  };

  const handleDeleteTodo = (deleteIndex) => {
    setTodos((prevs) => prevs.filter((_, index) => index !== deleteIndex));
  };

  const handleEditTodo = (editIndex) => {
    const valueToBeEdited = todos[editIndex].text;
    setTodoValue(valueToBeEdited);
    handleDeleteTodo(editIndex);
  };

  const toggleComplete = (index) => {
    setTodos((prevs) =>
      prevs.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <div className="dateBar">{today}</div>
      <TodoInputs
        handleAddTodos={handleAddTodos}
        todoValue={todoValue}
        setTodoValue={setTodoValue}
      />
      <TodoList
        handleDeleteTodo={handleDeleteTodo}
        todos={todos}
        handleEditTodo={handleEditTodo}
        toggleComplete={toggleComplete}
      />
    </>
  );
}
