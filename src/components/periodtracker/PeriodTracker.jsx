import React, { useState, useEffect } from 'react';
import './PeriodTracker.css';
import "../expenseTracker/ExpenseTracker.css";

const PeriodTracker = () => {
  const [cycles, setCycles] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // ✅ Load saved cycles on mount
  useEffect(() => {
    const saved = localStorage.getItem('cycles');
    if (saved) {
      setCycles(
        JSON.parse(saved).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      );
    }
  }, []);

  // ✅ Save cycles whenever they change
  useEffect(() => {
    if (cycles.length > 0) {
      localStorage.setItem('cycles', JSON.stringify(cycles));
    } else {
      localStorage.removeItem('cycles');
    }
  }, [cycles]);

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setNotes('');
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate) return alert('Please select a start date');

    if (editingId) {
      // Update existing cycle
      setCycles(
        cycles
          .map((c) =>
            c.id === editingId
              ? { ...c, startDate, endDate: endDate || null, notes }
              : c
          )
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      );
    } else {
      // Add new cycle
      const newCycle = {
        id: Date.now(),
        startDate,
        endDate: endDate || null,
        notes,
      };
      setCycles(
        [newCycle, ...cycles].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      );
    }

    resetForm();
  };

  const handleEdit = (cycle) => {
    setStartDate(cycle.startDate);
    setEndDate(cycle.endDate || '');
    setNotes(cycle.notes || '');
    setEditingId(cycle.id);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirmed = () => {
    setCycles(cycles.filter((c) => c.id !== deleteId));
    if (editingId === deleteId) resetForm();
    setDeleteId(null);
  };

  const handleDeleteCancelled = () => {
    setDeleteId(null);
  };

  const clearAllCycles = () => {
    setCycles([]);
    resetForm();
  };

  return (
    <div className="period-tracker">
      <h1>🌸 Period Tracker</h1>

      <form onSubmit={handleSubmit} className="cycle-form">
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date (optional):</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label>Notes:</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Symptoms, mood, etc."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingId ? 'Update Cycle' : 'Add Cycle'}
          </button>
          {editingId && (
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
          {cycles.length > 0 && !editingId && (
            <button type="button" className="cancel-btn" onClick={clearAllCycles}>
              Clear All
            </button>
          )}
        </div>
      </form>

      <div className="cycles-list">
        <h2>Logged Cycles</h2>
        {cycles.length === 0 ? (
          <p className="no-transactions">No cycles logged yet.</p>
        ) : (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cycles.map((cycle) => (
                  <tr key={cycle.id}>
                    <td>{cycle.startDate}</td>
                    <td>{cycle.endDate || 'N/A'}</td>
                    <td>{cycle.notes || '-'}</td>
                    <td className="actions-cell">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(cycle)}
                        aria-label="Edit cycle"
                      ></button>
                      <button
                        className="delete-btn"
                        onClick={() => confirmDelete(cycle.id)}
                        aria-label="Delete cycle"
                      ></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Delete this cycle entry?</p>
            <div className="modal-actions">
              <button className="modal-ok-btn" onClick={handleDeleteConfirmed}>
                Delete
              </button>
              <button className="modal-cancel-btn" onClick={handleDeleteCancelled}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodTracker;
