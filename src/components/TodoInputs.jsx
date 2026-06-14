import React from 'react'

export default function TodoInputs({ handleAddTodos, setTodoValue, todoValue }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodos(todoValue);
    }
  };

  return (
    <div className="inputContainer">
      <input
        value={todoValue}
        onChange={(e) => setTodoValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder='Enter Task...'
      />
      <button onClick={() => handleAddTodos(todoValue)}>🎀</button>
    </div>
  )
}
