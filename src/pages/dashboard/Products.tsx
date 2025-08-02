import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import { exportToCSV } from '../../utils/exportCSV';

interface Product {
  id: string;
  name: string;
  version: string;
  description: string;
  price?: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: '', version: '', description: '', price: '' });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const confirmDelete = (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteConfirmed = async () => {
    if (deleteDialog.id) {
      await api.delete(`/products/${deleteDialog.id}`);
      setProducts(products.filter(p => p.id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
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
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(
          p =>
            p.name.toLowerCase().includes(lower) ||
            p.version.toLowerCase().includes(lower) ||
            p.description.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: '', version: '', description: '', price: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        name: form.name,
        version: form.version,
        description: form.description,
        price: form.price ? parseFloat(form.price) : undefined,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      resetForm();
      fetchProducts();
    } catch {
      setError(editingId ? 'Failed to update product' : 'Failed to create product');
    }
  };


   const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      version: product.version,
      description: product.description,
      price: product.price?.toString() || '',
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      setError('Failed to delete product');
    }
  };

  return (
    <div>
      <h2>Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Search / Filter */}
      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search products by name, version, or description..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="version" placeholder="Version" value={form.version} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />

        <button type="submit">{editingId ? "Update Product" : "Create Product"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

        
      <button onClick={() => exportToCSV(products, 'products')}>
        Export CSV
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.version}</td>
              <td>{product.description}</td>
              <td>{product.price ? `$${product.price.toFixed(2)}` : 'N/A'}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>{' '}
                <button onClick={() => confirmDelete(product.id)} style={{ color: 'red' }}>
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
      <p style={{ marginTop: 20 }}>
        Total Products: <strong>{products.length}</strong>
      </p>
    </div>
  );
};

export default Products;
