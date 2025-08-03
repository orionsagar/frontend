import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { exportToCSV } from '../../utils/exportCSV';

interface AuditLog {
  id: number;
  userId: string;
  userName: string;
  entityName: string;
  entityId: string;
  action: string;
  changes?: string;
  timestamp: string;
}

const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auditlogs'); // Adjust endpoint
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.entityName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>

      <input
        type="text"
        placeholder="Search by user, entity, or action"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded p-2 mb-4 w-full max-w-md"
      />

        <button onClick={() => exportToCSV(logs, 'Audit Log')}>
            Export CSV
          </button>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Timestamp</th>
                <th className="border p-2 text-left">User</th>
                <th className="border p-2 text-left">Entity</th>
                <th className="border p-2 text-left">Entity ID</th>
                <th className="border p-2 text-left">Action</th>
                <th className="border p-2 text-left">Changes</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="border p-2">{log.userName}</td>
                  <td className="border p-2">{log.entityName}</td>
                  <td className="border p-2">{log.entityId}</td>
                  <td className="border p-2 text-blue-600">{log.action}</td>
                  <td className="border p-2 whitespace-pre-wrap max-w-xs">
                    {log.changes ? (
                      <pre className="bg-gray-50 p-1 rounded text-xs overflow-x-auto">{log.changes}</pre>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 p-4">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
