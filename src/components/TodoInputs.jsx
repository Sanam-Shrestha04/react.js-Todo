import React, { useState } from 'react'

export default function TodoInputs({handleAddTodos, setTodoValue, todoValue}) {

  return (
    <header>
        <input 
          value={todoValue} //bind todoValue means capture todo value
          onChange={(e) => {setTodoValue(e.target.value)}}  //listens the changes and whenever the value of input changes it calls setTodoValue function and e.target.value pass the new text that get entered into our input 
          placeholder='Enter todo...'
        />
        <button onClick={() =>{
          handleAddTodos(todoValue) // currently not defined, the value we type to add in list
          setTodoValue('')
          }}>Add
        </button>
    </header>
  )
}
