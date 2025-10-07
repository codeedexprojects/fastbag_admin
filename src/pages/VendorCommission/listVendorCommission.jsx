import React, { useState, useEffect } from 'react';
import { DollarSign, Store, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { listCommission, updateCommissionStatus } from '../../services/allApi';

const VendorCommissionPage = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const data = await listCommission();
      setCommissions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (commissionId, status) => {
    try {
      setUpdatingId(commissionId);
      await updateCommissionStatus(commissionId, status);
      await fetchCommissions();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'status-paid', icon: CheckCircle, label: 'Paid' },
      pending: { color: 'status-pending', icon: Clock, label: 'Pending' },
      unpaid: { color: 'status-unpaid', icon: AlertCircle, label: 'Unpaid' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`status-badge ${config.color}`}>
        <Icon style={{ width: '12px', height: '12px' }} />
        {config.label}
      </span>
    );
  };

  const filteredCommissions = filterStatus === 'all' 
    ? commissions 
    : commissions.filter(c => c.payment_status?.toLowerCase() === filterStatus);

  const totalCommissionAmount = commissions.reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0);
  const paidAmount = commissions
    .filter(c => c.payment_status?.toLowerCase() === 'paid')
    .reduce((sum, c) => sum + parseFloat(c.commission_amount || 0), 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading commissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <style>{`
        .page-container {
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 24px;
        }

        .content-wrapper {
          max-width: 1280px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 32px;
        }

        .header h1 {
          font-size: 30px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 8px;
        }

        .header p {
          color: #6b7280;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          padding: 24px;
          border: 1px solid #e5e7eb;
        }

        .stat-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-info p:first-child {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .stat-info p:last-child {
          font-size: 24px;
          font-weight: bold;
        }

        .stat-card:nth-child(1) .stat-info p:last-child {
          color: #111827;
        }

        .stat-card:nth-child(2) .stat-info p:last-child {
          color: #16a34a;
        }

        .stat-card:nth-child(3) .stat-info p:last-child {
          color: #111827;
        }

        .stat-icon {
          padding: 12px;
          border-radius: 8px;
        }

        .stat-icon.blue {
          background-color: #dbeafe;
        }

        .stat-icon.green {
          background-color: #dcfce7;
        }

        .stat-icon.purple {
          background-color: #f3e8ff;
        }

        .stat-icon svg {
          width: 24px;
          height: 24px;
        }

        .stat-icon.blue svg {
          color: #2563eb;
        }

        .stat-icon.green svg {
          color: #16a34a;
        }

        .stat-icon.purple svg {
          color: #9333ea;
        }

        .filter-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          padding: 16px;
          margin-bottom: 24px;
          border: 1px solid #e5e7eb;
        }

        .filter-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filter-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-button {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-button.active {
          background-color: #2563eb;
          color: white;
        }

        .filter-button:not(.active) {
          background-color: #f3f4f6;
          color: #374151;
        }

        .filter-button:not(.active):hover {
          background-color: #e5e7eb;
        }

        .table-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        th {
          padding: 16px 24px;
          text-align: left;
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        th.text-right {
          text-align: right;
        }

        th.text-center {
          text-align: center;
        }

        tbody tr {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
        }

        tbody tr:hover {
          background-color: #f9fafb;
        }

        td {
          padding: 16px 24px;
        }

        .vendor-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vendor-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .vendor-info p:first-child {
          font-weight: 500;
          color: #111827;
          margin-bottom: 2px;
        }

        .vendor-info p:last-child {
          font-size: 14px;
          color: #6b7280;
        }

        .store-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background-color: #eff6ff;
          color: #1d4ed8;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .store-type-badge svg {
          width: 12px;
          height: 12px;
        }

        .text-right {
          text-align: right;
        }

        .text-center {
          text-align: center;
        }

        .amount {
          font-weight: 500;
          color: #111827;
        }

        .commission-percentage {
          font-weight: 600;
          color: #2563eb;
        }

        .commission-amount {
          font-weight: bold;
          color: #16a34a;
        }

        .date-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 14px;
          color: #6b7280;
        }

        .date-cell svg {
          width: 16px;
          height: 16px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-paid {
          background-color: #dcfce7;
          color: #166534;
        }

        .status-pending {
          background-color: #fef3c7;
          color: #854d0e;
        }

        .status-unpaid {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .actions-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .mark-paid-button {
          padding: 4px 12px;
          background-color: #16a34a;
          color: white;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .mark-paid-button:hover:not(:disabled) {
          background-color: #15803d;
        }

        .mark-paid-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 48px 0;
        }

        .empty-state svg {
          width: 48px;
          height: 48px;
          color: #9ca3af;
          margin: 0 auto 16px;
        }

        .empty-state p {
          color: #6b7280;
        }

        .loading-container {
          min-height: 100vh;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-content {
          text-align: center;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 2px solid #e5e7eb;
          border-bottom-color: #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          margin-top: 16px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 16px;
          }

          .header h1 {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filter-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-buttons {
            width: 100%;
          }

          .filter-button {
            flex: 1;
          }

          table {
            font-size: 14px;
          }

          th, td {
            padding: 12px 16px;
          }
        }
      `}</style>

      <div className="content-wrapper">
        {/* Header */}
        <div className="header">
          <h1>Vendor Commissions</h1>
          <p>Manage and track vendor commission payments</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p>Total Commissions</p>
                <p>₹{totalCommissionAmount.toFixed(2)}</p>
              </div>
              <div className="stat-icon blue">
                <DollarSign />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p>Paid Amount</p>
                <p>₹{paidAmount.toFixed(2)}</p>
              </div>
              <div className="stat-icon green">
                <CheckCircle />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p>Total Vendors</p>
                <p>{commissions.length}</p>
              </div>
              <div className="stat-icon purple">
                <Store />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-card">
          <div className="filter-content">
            <span className="filter-label">Filter by status:</span>
            <div className="filter-buttons">
              {['all', 'paid', 'pending', 'unpaid'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`filter-button ${filterStatus === status ? 'active' : ''}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Store Type</th>
                  <th className="text-right">Total Sales</th>
                  <th className="text-center">Commission %</th>
                  <th className="text-right">Commission Amount</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.map((commission) => (
                  <tr key={commission.id}>
                    <td>
                      <div className="vendor-cell">
                        <img
                          src={commission.vendor.display_image}
                          alt={commission.vendor.business_name}
                          className="vendor-avatar"
                        />
                        <div className="vendor-info">
                          <p>{commission.vendor.business_name}</p>
                          <p>{commission.vendor.contact_number}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="store-type-badge">
                        <Store />
                        {commission.vendor.store_type}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="amount">
                        ₹{parseFloat(commission.total_sales).toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="commission-percentage">
                        {parseFloat(commission.commission_percentage).toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="commission-amount">
                        ₹{parseFloat(commission.commission_amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="date-cell">
                        <Calendar />
                        {commission.created_at}
                      </div>
                    </td>
                    <td className="text-center">
                      {getStatusBadge(commission.payment_status)}
                    </td>
                    <td>
                      <div className="actions-cell">
                        {commission.payment_status?.toLowerCase() !== 'paid' && (
                          <button
                            onClick={() => handleUpdateStatus(commission.id, 'paid')}
                            disabled={updatingId === commission.id}
                            className="mark-paid-button"
                          >
                            {updatingId === commission.id ? 'Updating...' : 'Mark Paid'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCommissions.length === 0 && (
            <div className="empty-state">
              <AlertCircle />
              <p>No commissions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorCommissionPage;