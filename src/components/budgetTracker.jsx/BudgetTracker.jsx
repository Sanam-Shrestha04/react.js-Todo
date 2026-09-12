import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./BudgetTracker.css";

const BudgetTracker = () => {
  const [budget, setBudget] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenses, setExpenses] = useState({});

  // ✅ Current month key (YYYY-MM)
  const currentMonthKey = new Date().toISOString().slice(0, 7);

  // ✅ Load saved budget for this month
  useEffect(() => {
    const savedBudgets = JSON.parse(localStorage.getItem("monthlyBudgets")) || {};
    if (savedBudgets[currentMonthKey]) {
      setBudget(savedBudgets[currentMonthKey]);
    }
  }, [currentMonthKey]);

  // ✅ Save budget whenever it changes
  useEffect(() => {
    const savedBudgets = JSON.parse(localStorage.getItem("monthlyBudgets")) || {};
    savedBudgets[currentMonthKey] = budget;
    localStorage.setItem("monthlyBudgets", JSON.stringify(savedBudgets));
  }, [budget, currentMonthKey]);

  // ✅ Load expenses from ExpenseTracker for this month
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("monthlyData")) || {};
    const monthData = savedExpenses[currentMonthKey]?.transactions || [];

    const expenseTotals = monthData.reduce((acc, item) => {
      if (item.type === "expense") {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
      }
      return acc;
    }, {});
    setExpenses(expenseTotals);
  }, [currentMonthKey]);

  // ✅ Handle budget input
  const handleBudgetChange = (category, value) => {
    setBudget({ ...budget, [category]: parseFloat(value) || 0 });
  };

  // ✅ Calculate total income
  useEffect(() => {
    const total = Object.values(budget).reduce((sum, val) => sum + val, 0);
    setTotalIncome(total);
  }, [budget]);

  // ✅ Prepare chart data
  const chartData = {
    labels: Object.keys(expenses),
    datasets: [
      {
        label: "Expenses",
        data: Object.keys(expenses).map((cat) => expenses[cat]),
        backgroundColor: [
          "#ff9ebc",
          "#f8b4d9",
          "#fdd0e8",
          "#ffc7d4",
          "#ffb3c6",
          "#f9a8d4",
          "#f472b6",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="budget-tracker">
      <h1>💰 Budget Tracker ({currentMonthKey})</h1>

      <div className="budget-inputs">
        <h3>Set Your Monthly Budget</h3>
        {["Grocery", "Travel", "Office Lunch", "Snack", "Shopping", "Rent", "Other"].map(
          (category) => (
            <div key={category} className="budget-row">
              <label>{category}:</label>
              <input
                type="number"
                placeholder="Enter budget"
                value={budget[category] || ""}
                onChange={(e) => handleBudgetChange(category, e.target.value)}
              />
            </div>
          )
        )}
      </div>

      <div className="chart-section">
        <h3>Expense Distribution</h3>
        <Pie data={chartData} />
      </div>

      <div className="summary">
        <p>Total Budget: ${totalIncome.toFixed(2)}</p>
        <p>
          Total Expenses: $
          {Object.values(expenses).reduce((sum, val) => sum + val, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BudgetTracker;
