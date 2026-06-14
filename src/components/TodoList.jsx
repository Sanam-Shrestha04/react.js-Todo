import React from "react";
import TodoCard from "./TodoCard";

export default function TodoList({ todos, handleDeleteTodo, handleEditTodo, toggleComplete }) {
  return (
    <ul className="main">
      {todos.map((todo, todoIndex) => (
        <TodoCard
          handleDeleteTodo={handleDeleteTodo}
          handleEditTodo={handleEditTodo}
          toggleComplete={toggleComplete}
          key={todoIndex}
          index={todoIndex}
          todo={todo}
        />
      ))}
    </ul>
  );
}
