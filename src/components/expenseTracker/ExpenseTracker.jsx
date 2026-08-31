import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ExpenseTracker.css";

const ExpenseTracker = () => {
  const currentMonthKey = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  const [monthlyData, setMonthlyData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [date, setDate] = useState("");

  // Load saved data from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("monthlyData")) || {};
    setMonthlyData(saved);

    // If current month not present, initialize it
    if (!saved[currentMonthKey]) {
      saved[currentMonthKey] = { transactions: [] };
      localStorage.setItem("monthlyData", JSON.stringify(saved));
    }
  }, []);

  // Save whenever monthlyData changes
  useEffect(() => {
    localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
  }, [monthlyData]);

  const transactions = monthlyData[selectedMonth]?.transactions || [];

  // Totals
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.category !== "Investment")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalInvestment = transactions
    .filter((t) => t.category === "Investment")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const savings = totalIncome - totalExpense;

  const categories = {
    expense: ["Grocery", "Travel", "Office Lunch", "Snack", "Shopping", "Other"],
    income: ["Salary", "Funding", "Investment", "Other"],
  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (!category || !amount) {
    alert("Please fill in all fields");
    return;
  }

  // Use the transaction's date to determine its month
  const transactionDate = date ? new Date(date) : new Date();
  const monthKey = transactionDate.toISOString().slice(0, 7); // "YYYY-MM"

  const transactionData = {
    id: editingId || uuidv4(),
    type,
    category,
    amount: parseFloat(amount),
    description: description || category,
    date: transactionDate.toISOString(),
    formattedDate: transactionDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // Get existing month data or create new
  let updatedMonth = monthlyData[monthKey] || { transactions: [] };

  if (editingId) {
    updatedMonth.transactions = updatedMonth.transactions
      .map((t) => (t.id === editingId ? transactionData : t))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    updatedMonth.transactions = [transactionData, ...updatedMonth.transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }

  // Save back to monthlyData
  setMonthlyData({ ...monthlyData, [monthKey]: updatedMonth });

  // Reset form
  setCategory("");
  setAmount("");
  setDescription("");
  setDate("");
  setEditingId(null);
};


  const handleDelete = (id) => setConfirmDeleteId(id);

  const confirmDelete = () => {
    let updatedMonth = { ...monthlyData[selectedMonth] };
    updatedMonth.transactions = updatedMonth.transactions.filter((t) => t.id !== confirmDeleteId);
    setMonthlyData({ ...monthlyData, [selectedMonth]: updatedMonth });
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => setConfirmDeleteId(null);

  const handleEdit = (transaction) => {
    setType(transaction.type);
    setCategory(transaction.category);
    setAmount(transaction.amount.toString());
    setDescription(transaction.description);
    setEditingId(transaction.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCategory("");
    setAmount("");
    setDescription("");
    setType("expense");
  };

  const monthOptions = Object.keys(monthlyData).sort(); // ["2026-07", "2026-08", ...]

  return (
    <div className="expense-tracker">
      <h1>💰 Expense Tracker</h1>

      {/* Month Selector */}
<div className="form-header">
  <div className="month-selector">
    <label className="month-label">Month:</label>
    <select
      className="month-dropdown"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    >
      {monthOptions.map((month) => (
        <option key={month} value={month}>
          {month}
        </option>
      ))}
    </select>
  </div>
</div>



      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card expense-card">
          <h3>Total Expense</h3>
          <p>${totalExpense.toFixed(2)}</p>
        </div>
        <div className="card income-card">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card investment-card">
          <h3>Investment</h3>
          <p>${totalInvestment.toFixed(2)}</p>
        </div>
        <div className={`card saving-card ${savings >= 0 ? "positive" : "negative"}`}>
          <h3>Savings</h3>
          <p>${savings.toFixed(2)}</p>
        </div>
      </div>

      {/* Add/Edit Transaction Form */}
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount ($):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="form-group">
          <label>Description (optional):</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingId ? "Update Transaction" : "Add Transaction"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Transactions List */}
      <div className="transactions-list">
        <h2>Transactions for {selectedMonth}</h2>
        {transactions.length === 0 ? (
          <p className="no-transactions">No transactions yet. Add your first one!</p>
        ) : (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className={transaction.type}>
                    <td>{transaction.formattedDate}</td>
                    <td>
                      <span className={`badge ${transaction.type}`}>{transaction.type}</span>
                    </td>
                    <td>{transaction.category}</td>
                    <td>{transaction.description}</td>
                      <td className={`amount-cell ${transaction.type}`}>
                      {transaction.type === "expense" ? "-" : "+"}$
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="edit-btn"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to delete this transaction?</p>
            <div className="modal-actions">
              <button className="modal-ok-btn" onClick={confirmDelete}>
                Delete
              </button>
              <button className="modal-cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
