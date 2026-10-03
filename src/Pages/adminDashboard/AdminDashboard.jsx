import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, 
  Select, MenuItem, IconButton, CircularProgress, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('token');

  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:5000/api/v1/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Extracting array safely from various response structures
      const userData = response.data.users || response.data.data || response.data;
      
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else {
        setUsers([]);
        setError("Invalid data format received from server.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please verify your authentication credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/users/role/${userId}`, 
        { role: newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
    
      setUsers(prevUsers => 
        prevUsers.map(user => 
          (user._id === userId || user.id === userId) ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update user role.");
    }
  };


  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
     
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId && user.id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#ff6f00' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, color: '#fff' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#ff6f00' }}>
        Admin Dashboard - User Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, bgcolor: '#2d1515', color: '#ffb4ab' }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a', border: '1px solid #333' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id || user.id} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ color: '#ccc' }}>{user.name || user.username}</TableCell>
                  <TableCell sx={{ color: '#ccc' }}>{user.email}</TableCell>
                  
                  <TableCell>
                    <Select
                      value={user.role || 'user'}
                      onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                      sx={{ color: '#fff', bgcolor: '#2a2a2a', height: '35px', '& .MuiSvgIcon-root': { color: '#fff' } }}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteUser(user._id || user.id)}
                      sx={{ '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: '#888', py: 4 }}>
                  No users found in the system.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}