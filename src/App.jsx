import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import Todo from "./components/todo/Todo";
import ExpenseTracker from "./components/expenseTracker/ExpenseTracker";
import PeriodTracker from "./components/periodtracker/PeriodTracker";

export default function App() {
  return (
    <>
      {/* Navigation bar */}
      <nav>
        <NavLink to="/" end>
          Todo
        </NavLink>
        <NavLink to="/expense-tracker">Expense Tracker</NavLink>
        <NavLink to="/period-tracker">Period Tracker</NavLink>
      </nav>

      {/* Page routes */}
      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/expense-tracker" element={<ExpenseTracker />} />
        <Route path="/period-tracker" element={<PeriodTracker />} />
      </Routes>
    </>
  );
}
