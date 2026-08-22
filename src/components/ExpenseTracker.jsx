// src/components/ExpenseTracker.jsx
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ExpenseTracker.css";

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [date, setDate] = useState("");

  // Load transactions from localStorage on mount
  // Load transactions from localStorage on mount
  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Calculate totals
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
    expense: [
      "Grocery",
      "Travel",
      "Office Lunch",
      "Snack",
      "Shopping",
      "Other",
    ],
    income: ["Salary", "Funding", "Investment", "Other"],
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category || !amount) {
      alert("Please fill in all fields");
      return;
    }
    const transactionDate = date ? new Date(date) : new Date();
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

    if (editingId) {
      // Update existing transaction
      setTransactions(
        transactions.map((t) => (t.id === editingId ? transactionData : t)),
      );
      setEditingId(null);
    } else {
      // Add new transaction
      setTransactions([transactionData, ...transactions]);
    }

    // Reset form
    setCategory("");
    setAmount("");
    setDescription("");
    setDate("");
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    setTransactions(transactions.filter((t) => t.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

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

  return (
    <div className="expense-tracker">
      <h1>💰 Expense Tracker</h1>

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
        <div
          className={`card saving-card ${savings >= 0 ? "positive" : "negative"}`}
        >
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
            max={new Date().toISOString().split("T")[0]} // prevents future dates
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
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
            <button
              type="button"
              onClick={handleCancelEdit}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Transactions List */}
      <div className="transactions-list">
        <h2>Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="no-transactions">
            No transactions yet. Add your first one!
          </p>
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
                    <td className="date-cell">{transaction.formattedDate}</td>
                    <td className="type-cell">
                      <span className={`badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
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
      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to delete this transaction?</p>
            <div className="modal-actions">
              <button className="modal-ok-btn" onClick={confirmDelete}>
                {" "}
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
