import React, { useState, useEffect } from 'react';
import UserController from './users.controller';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const response = await UserController.getAllUsers();
        if (response.success) {
            setUsers(response.data);
        } else {
            setMessage(response.message);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let response;
        if (editingUser) {
            response = await UserController.updateUser(editingUser.id, formData);
        } else {
            response = await UserController.createUser(formData);
        }

        if (response.success) {
            setMessage(response.message);
            setShowModal(false);
            resetForm();
            loadUsers();
        } else {
            setMessage(response.message);
        }
        setLoading(false);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            setLoading(true);
            const response = await UserController.deleteUser(id);
            if (response.success) {
                setMessage(response.message);
                loadUsers();
            } else {
                setMessage(response.message);
            }
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: ''
        });
        setEditingUser(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>Gestión de Usuarios</h1>
                <button 
                    className="btn btn-primary" 
                    onClick={openCreateModal}
                    disabled={loading}
                >
                    Nuevo Usuario
                </button>
            </div>

            {message && (
                <div className="alert">
                    {message}
                    <button onClick={() => setMessage('')}>×</button>
                </div>
            )}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>Correo Electrónico</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="loading">Cargando...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">No hay usuarios registrados</td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <button 
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleEdit(user)}
                                            disabled={loading}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(user.id)}
                                            disabled={loading}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                            <button 
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-group">
                                <label htmlFor="fullName">Nombre Completo:</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Correo Electrónico:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Teléfono:</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;