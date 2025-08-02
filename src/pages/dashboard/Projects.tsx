import React, { useEffect, useState } from "react";
import api from '../../api/api';
import { Link } from 'react-router-dom';
import { exportToCSV } from '../../utils/exportCSV';

type Project = {
  id: string;
  name: string;
  description: string;
  productId: string;
};

type Product = {
  id: string;
  name: string;
};

const ProjectsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productId, setProductId] = useState("");
  const [error, setError] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

 const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      setError('Failed to fetch projects');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchProducts();
  }, []);

  // Filter projects on search term change
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = projects.filter((project) => {
      const product = products.find((p) => p.id === project.productId);
      const productName = product ? product.name.toLowerCase() : '';

      return (
        project.name.toLowerCase().includes(lowerSearch) ||
        project.description.toLowerCase().includes(lowerSearch) ||
        productName.includes(lowerSearch)
      );
    });

    setFilteredProjects(filtered);
  }, [searchTerm, projects, products]);

  const getProductName = (id: string) => {
    const product = products.find(p => p.id === id);
    return product ? product.name : 'Unknown';
  };

const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProjectId) {
      // Update
      const res = await api.put(`/projects/${editingProjectId}`, {
        name,
        description,
        productId,
      });
      setProjects(projects.map(p => (p.id === editingProjectId ? res.data : p)));
      setEditingProjectId(null);
    } else {
      // Create
      const res = await api.post("/projects", {
        name,
        description,
        productId,
      });
      setProjects([...projects, res.data]);
    }

    setName("");
    setDescription("");
    setProductId("");
  };

  const handleEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setName(project.name);
    setDescription(project.description);
    setProductId(project.productId);
  };

  const confirmDelete = (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirmed = async () => {
    if (deleteDialog.id) {
      await api.delete(`/projects/${deleteDialog.id}`);
      setProjects(projects.filter(p => p.id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{editingProjectId ? "Edit Project" : "Create Project"}</h2>

      <input
        type="text"
        placeholder="Search projects by name, description, or product"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 15, padding: 8, width: '100%', maxWidth: 400 }}
      />


      <form onSubmit={handleCreateOrUpdate}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option value={product.id} key={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <button type="submit">{editingProjectId ? "Update" : "Create"}</button>
        {editingProjectId && (
          <button
            type="button"
            onClick={() => {
              setEditingProjectId(null);
              setName("");
              setDescription("");
              setProductId("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <button onClick={() => exportToCSV(projects, 'projects')}>
        Export CSV
      </button>
      <table style={{ marginTop: 20, width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Product</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>{getProductName(project.productId)}</td>
              <td>
                <Link
                  to={`/dashboard/items?projectId=${project.id}`}
                  style={{ color: 'blue', marginRight: 10 }}
                >
                  View Items
                </Link>
                <button onClick={() => handleEdit(project)} style={{ marginRight: 5 }}>
                  Edit
                </button>
                <button onClick={() => confirmDelete(project.id)} style={{ color: 'red' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteDialog.open && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "20px", borderRadius: "8px",
            width: "300px", textAlign: "center"
          }}>
            <p>Are you sure you want to delete this project?</p>
            <button
              onClick={handleDeleteConfirmed}
              style={{ marginRight: 10, backgroundColor: "red", color: "#fff", padding: "5px 10px" }}
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteDialog({ open: false, id: null })}
              style={{ padding: "5px 10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProjectsPage;
