import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  CircularProgress,
  Stack 
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../Services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleDeleteOrder = (currentOrderId) => {
    setOrders((prevOrders) => 
      prevOrders.filter((order) => (order.id || order._id) !== currentOrderId)
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
     
      <Box sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBackIcon />}
          sx={{ 
            color: '#ff6f00', 
            fontWeight: 600, 
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.08)' } 
          }}
        >
          Back to Homepage
        </Button>
      </Box>

      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box 
          sx={{ 
            p: 1.5, 
            borderRadius: '12px', 
            bgcolor: 'rgba(255, 111, 0, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 32, color: '#ff6f00' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            My Orders
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
           
          </Typography>
        </Box>
      </Box>

      
      <Paper 
        elevation={0}
        sx={{ 
          bgcolor: '#141414', 
          p: { xs: 2, sm: 4 }, 
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#ff6f00' }} />
          </Box>
        ) : error ? (
          <Typography sx={{ textAlign: 'center', py: 6, color: '#f44336' }}>{error}</Typography>
        ) : orders.length > 0 ? (
          <Stack spacing={2.5}>
            {orders.map((order) => {
              const currentOrderId = order.id || order._id;
              const currentOrderTitle = order.productTitle || order.items?.[0]?.title || 'Order Item';
              const productImage = order.productImage || order.image || order.items?.[0]?.image || 'https://via.placeholder.com/80';

              return (
                <Box 
                  key={currentOrderId} 
                  sx={{ 
                    p: 2.5, 
                    borderRadius: '14px',
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'rgba(255, 111, 0, 0.3)',
                      bgcolor: 'rgba(255, 255, 255, 0.04)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: '220px' }}>
                    <Box 
                      component="img"
                      src={productImage}
                      alt={currentOrderTitle}
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        objectFit: 'contain', 
                        bgcolor: '#fff', 
                        borderRadius: '10px',
                        p: 0.5,
                        flexShrink: 0
                      }}
                    />

                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', mb: 0.5 }}>
                        {currentOrderTitle}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ fontSize: '0.85rem', color: '#888' }}>
                        <span>Unit Price: <strong style={{ color: '#ccc' }}>${order.price || order.items?.[0]?.price}</strong></span>
                        <span>Qty: <strong style={{ color: '#ccc' }}>{order.quantity || order.items?.[0]?.quantity || 1}</strong></span>
                      </Stack>
                    </Box>
                  </Box>

                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={1.5} 
                    sx={{ 
                      width: { xs: '100%', sm: 'auto' }, 
                      justifyContent: { xs: 'space-between', sm: 'flex-end' }, 
                      flexWrap: 'nowrap' 
                    }}
                  >
                    <Box sx={{ textAlign: 'right', mr: 1 }}>
                      <Typography sx={{ fontWeight: 800, color: '#ff6f00', fontSize: '1.15rem' }}>
                        ${order.totalAmount || ((order.price || 0) * (order.quantity || 1))}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600, display: 'block' }}>
                        Success
                      </Typography>
                    </Box>

                    
                    <Button 
                      variant="contained"
                      onClick={() => navigate(`/orders/${currentOrderId}`)}
                      startIcon={<VisibilityOutlinedIcon />}
                      sx={{ 
                        bgcolor: 'rgba(255, 111, 0, 0.15)', 
                        color: '#ff6f00',
                        borderColor: 'rgba(255, 111, 0, 0.3)',
                        fontWeight: 600, 
                        textTransform: 'none',
                        borderRadius: '10px',
                        px: 2,
                        py: 1,
                        boxShadow: 'none',
                        '&:hover': { 
                          bgcolor: '#ff6f00', 
                          color: '#fff',
                          boxShadow: '0 4px 12px rgba(255, 111, 0, 0.3)'
                        } 
                      }}
                    >
                      See Details
                    </Button>

                    <Button 
                      variant="outlined"
                      onClick={() => handleDeleteOrder(currentOrderId)}
                      sx={{ 
                        color: '#ff4d4d', 
                        borderColor: 'rgba(255, 77, 77, 0.3)',
                        fontWeight: 600, 
                        textTransform: 'none',
                        borderRadius: '10px',
                        minWidth: 'auto',
                        px: 1.5,
                        py: 1,
                        '&:hover': { 
                          bgcolor: 'rgba(255, 77, 77, 0.08)', 
                          borderColor: '#ff4d4d' 
                        } 
                      }}
                      title="Remove Order"
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </Button>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: '#888', mb: 2, fontSize: '1rem' }}>
              Your order list is currently empty.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ 
                bgcolor: '#ff6f00', 
                fontWeight: 700, 
                textTransform: 'none',
                borderRadius: '10px',
                px: 3,
                py: 1.2,
                '&:hover': { bgcolor: '#e56200' } 
              }}
            >
              Explore Catalog
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}