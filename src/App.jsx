import React, { useEffect, useState } from 'react'
import TodoList from './components/TodoList'
import TodoInputs from './components/TodoInputs'

export default function App() {

  const[todos, setTodos] = useState([]);
  const [todoValue, setTodoValue ] = useState('');

  const handleAddTodos = (newTodo) => {
    setTodos((prevs) => [...prevs,newTodo])
  }

  const handleDeleteTodo =(deleteIndex) => { 
    setTodos((prevs) => prevs.filter((todo,index) => index !==  deleteIndex))
  }

  const handleEditTodo =(editIndex) => { 
    const valueToBeEdited = todos[editIndex]; //edit index get the index at which we are deleting 
    setTodoValue(valueToBeEdited);
    handleDeleteTodo(editIndex);
  }

  // useEffect({}[])

  return (
    <>
      <TodoInputs 
        handleAddTodos={handleAddTodos} 
        todoValue={todoValue} 
        setTodoValue={setTodoValue} 
      />

      <TodoList 
        handleDeleteTodo={handleDeleteTodo} 
        todos={todos} 
        handleEditTodo={handleEditTodo}
      />
    </>
  )
}
