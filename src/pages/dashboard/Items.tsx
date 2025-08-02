import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from '../../api/api';
import { exportToCSV } from '../../utils/exportCSV';

type ProductItem = {
  id: string;
  name: string;
  description?: string;
  status: string;
  projectId: string;
};

type Project = {
  id: string;
  name: string;
};

// Helper to extract query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const statusColors: Record<string, string> = {
  Pending: "gray",
  InProgress: "blue",
  Completed: "green",
  Blocked: "red",
};

const statusMap: Record<string, string> = {
  "1": "Pending",
  "2": "In Progress",
  "3": "Completed",
  "4": "Blocked",
};

const ProductItemsPage: React.FC = () => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [describetion, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const query = useQuery();
  const projectId = query.get("projectId");

  useEffect(() => {
    if (projectId) {
      // Load project items
      api.get(`/projects/${projectId}/items`)
        .then((res) => setItems(res.data))
        .catch(() => alert("Failed to fetch items"));

      // Load project details to get the name
      api.get(`/projects/${projectId}`)
        .then((res) => setProject(res.data))
        .catch(() => alert("Failed to fetch project info"));
    }
  }, [projectId]);

  // Filter items on search term change
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = items.filter((item) => {
      const project = items.find((p) => p.id === item.projectId);
      const projectName = project ? project.name.toLowerCase() : '';

      //item.description.toLowerCase().includes(lowerSearch) ||
      return (
        item.name.toLowerCase().includes(lowerSearch) ||
        projectName.includes(lowerSearch)
      );
    });

    setFilteredItems(filtered);
  }, [searchTerm, items, project]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return alert("Missing projectId");

    const response = await api.post(`/projects/${projectId}/items`, {
      name,
      describetion,
      status,
    });
    setItems([...items, response.data]);
    setName("");
    setDescription("");
    setStatus("1"); // Reset to "Pending"
  };

  const startEdit = (itemId: string, currentStatus: string) => {
    setEditingItemId(itemId);
    setEditingStatus(currentStatus);
  };


  const handleStatusUpdate = async (itemId: string) => {
    await api.put(`/projects/${projectId}/items/${itemId}`, {
      status: editingStatus,
    });

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: editingStatus } : item
      )
    );

    setEditingItemId(null);
    setEditingStatus("");
  };

  const handleEdit = (item: ProductItem) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || "");
    setStatus(item.status);
  };
  
  const handleUpdate = async () => {
    if (!editingId || !projectId) return;

    await api.put(`/projects/${projectId}/items/${editingId}`, {
      name,
      describetion,
      status,
    });

    setItems(items.map((item) =>
      item.id === editingId ? { ...item, name, describetion, status } : item
    ));

    setEditingId(null);
    setName("");
    setDescription("");
    setEditingStatus("");
    setStatus("1");
  };


  const handleDelete = async (itemId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) return;

    await api.delete(`/projects/${projectId}/items/${itemId}`);
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        Product Items for Project:{" "}
        <span style={{ color: "teal" }}>{project?.name || "Loading..."}</span>
      </h2>

      <input
        type="text"
        placeholder="Search items by name, description, or project"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 15, padding: 8, width: '100%', maxWidth: 400 }}
      />


     <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(); } : handleCreate}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea name="description" placeholder="Description" value={describetion} onChange={(e) => setDescription(e.target.value)} required />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="1">Pending</option>
          <option value="2">In Progress</option>
          <option value="3">Completed</option>
          <option value="4">Blocked</option>
        </select>
        <button type="submit">{editingId ? "Update Item" : "Create Item"}</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setName("");
            setDescription("");
            setEditingStatus("");
            setStatus("1");
          }}>
            Cancel
          </button>
        )}
      </form>

      <button onClick={() => exportToCSV(items, 'items_summary')}>
        Export CSV
      </button>

      <table style={{ width: "100%", marginTop: 20, textAlign: "left" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>
              <strong>{item.name}</strong>
            </td>
            <td>{item.description || "No description"}</td>
            <td>
              <span
                style={{
                  backgroundColor: statusColors[statusMap[item.status]] || "black",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: 12,
                }}
              >
                  {statusMap[item.status] || "Unknown"}
              </span>
            </td>
            <td>
              {editingItemId === item.id ? (
                <>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                  >
                    <option>Pending</option>
                    <option>InProgress</option>
                    <option>Completed</option>
                    <option>Blocked</option>
                  </select>
                  <button onClick={() => handleStatusUpdate(item.id)}>Save</button>
                  <button onClick={() => setEditingItemId(null)}>Cancel</button>
                </>
              ) : (
                <button onClick={() => startEdit(item.id, item.status)}>
                  Edit Status
                </button>
              )}
              <button onClick={() => handleEdit(item)}>Edit</button>{" "}
              <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }}>
                Delete
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>         
    </div>
  );
};

export default ProductItemsPage;
