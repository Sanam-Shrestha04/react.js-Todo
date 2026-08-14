import React from 'react'

export default function TodoCard({ todo, handleDeleteTodo, index, handleEditTodo, toggleComplete }) {
  return (
    <li className='todoItem'>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(index)}
      />
      <span className={`todoText ${todo.completed ? 'completed' : ''}`}>
        {todo.text}
      </span>
<div className='actionsContainer'>
        <button onClick={() => handleEditTodo(index)} className="edit-btn">✏️</button>
        <button onClick={() => handleDeleteTodo(index)} className="delete-btn">🗑️</button>
      </div>
    </li>
  )
}
