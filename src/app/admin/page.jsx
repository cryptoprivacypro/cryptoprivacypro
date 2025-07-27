"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/admin-transactions");
        const data = await response.json();
        setTransactions(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching admin transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Apply filters
  useEffect(() => {
    let filteredData = [...transactions];

    if (emailFilter.trim() !== "") {
      filteredData = filteredData.filter((tx) =>
        tx.email?.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }

    if (statusFilter.trim() !== "") {
      filteredData = filteredData.filter(
        (tx) => tx.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFiltered(filteredData);
    setCurrentPage(1); // Reset to first page when filters change
  }, [emailFilter, statusFilter, transactions]);

  // Convert data to CSV
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Time",
      "Wallet",
      "Chain",
      "Amount",
      "Status",
      "Email",
      "Product",
    ];
    const rows = filtered.map((tx) => [
      tx.transaction_id,
      new Date(tx.transaction_time).toLocaleString(),
      tx.wallet_address,
      tx.chain,
      tx.amount,
      tx.status,
      tx.email || "-",
      tx.product_title || "-",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Filter by email"
          className="p-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
        <select
          className="p-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <button
          onClick={exportToCSV}
          className="p-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
        >
          Download CSV
        </button>
      </div>

      {/* Data Table */}
      {loading ? (
        <p>Loading transactions...</p>
      ) : filtered.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <table className="w-full border border-gray-700 bg-gray-800 text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Wallet</th>
                <th className="px-4 py-2">Chain</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Product</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((tx) => (
                <tr key={tx.transaction_id} className="hover:bg-gray-700">
                  <td className="px-4 py-2">{tx.transaction_id}</td>
                  <td className="px-4 py-2">
                    {new Date(tx.transaction_time).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{tx.wallet_address}</td>
                  <td className="px-4 py-2">{tx.chain}</td>
                  <td className="px-4 py-2">{tx.amount}</td>
                  <td className="px-4 py-2">{tx.status}</td>
                  <td className="px-4 py-2">{tx.email || "-"}</td>
                  <td className="px-4 py-2">{tx.product_title || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

