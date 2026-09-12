import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import "./BudgetTracker.css";

const BudgetTracker = () => {
  const [budget, setBudget] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenses, setExpenses] = useState({});

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

  // ✅ Handle budget input (optional fields allowed)
  const handleBudgetChange = (category, value) => {
    if (value === "") {
      const updated = { ...budget };
      delete updated[category];
      setBudget(updated);
    } else {
      setBudget({ ...budget, [category]: parseFloat(value) || 0 });
    }
  };

  // ✅ Calculate total income
  useEffect(() => {
    const total = Object.values(budget).reduce((sum, val) => sum + val, 0);
    setTotalIncome(total);
  }, [budget]);

  // ✅ Prepare comparative chart data
  const categories = Array.from(
    new Set([...Object.keys(budget), ...Object.keys(expenses)])
  );

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Budget",
        data: categories.map((cat) => budget[cat] || 0),
        backgroundColor: [
          "#f8b4d9",
          "#ffc7d4",
          "#ff9ebc",
          "#fdd0e8",
          "#ffb3c6",
          "#f9a8d4",
          "#f472b6",
        ],
      },
      {
        label: "Expenses",
        data: categories.map((cat) => expenses[cat] || 0),
        backgroundColor: [
          "#e84a9e",
          "#d946ef",
          "#ec4899",
          "#db2777",
          "#be185d",
          "#9d174d",
          "#831843",
        ],
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
                placeholder="Optional"
                value={budget[category] || ""}
                onChange={(e) => handleBudgetChange(category, e.target.value)}
              />
            </div>
          )
        )}
      </div>

      <div className="chart-section">
        <h3>Budget vs Expenses</h3>
        <Doughnut data={chartData} />
      </div>

      <div className="summary">
        <p>Total Budget: ${totalIncome.toFixed(2)}</p>
        <p>
          Total Expenses: $
          {Object.values(expenses).reduce((sum, val) => sum + val, 0).toFixed(2)}
        </p>
      </div>

      <div className="category-summary">
        <h3>Category Breakdown</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Expense</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const b = budget[cat] || 0;
              const e = expenses[cat] || 0;
              const remaining = b - e;
              return (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>${b.toFixed(2)}</td>
                  <td>${e.toFixed(2)}</td>
                  <td
                    style={{ color: remaining < 0 ? "red" : "#e84a9e", fontWeight: 500 }}
                  >
                    ${remaining.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetTracker;
