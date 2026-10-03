import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  CircularProgress,
  Divider 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../Services/api';

export default function OrderDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: '#0a0a0a' }}>
        <CircularProgress sx={{ color: '#ff6f00' }} />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ color: '#f44336', mb: 3, fontSize: '1.2rem' }}>{error || "Order details unavailable."}</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/orders')}
          sx={{ bgcolor: '#ff6f00', '&:hover': { bgcolor: '#e56200' }, textTransform: 'none', borderRadius: '10px' }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  
  const productTitle = order.productTitle || order.items?.[0]?.title || 'Product Item';
  const productImage = order.productImage || order.image || order.items?.[0]?.image || 'https://via.placeholder.com/100';
  const productPrice = order.price || order.items?.[0]?.price || 0;
  const productQty = order.quantity || order.items?.[0]?.quantity || 1;
  const totalAmount = order.totalAmount || (productPrice * productQty);

  
  const formattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : 'N/A';

  
  const dbPaymentMethod = (order.paymentMethod || order.payment_method || 'cod').toLowerCase();
  
 
  const displayPaymentMethod = dbPaymentMethod === 'card' ? 'Online Card Payment' : 'Cash on Delivery (COD)';
  const displayPaymentStatus = dbPaymentMethod === 'card' ? 'Paid Successfully' : 'Pending / Cash on Delivery';
  const statusColor = dbPaymentMethod === 'card' ? '#4caf50' : '#ff9800'; 

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
     
      <Box sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          to="/orders" 
          startIcon={<ArrowBackIcon />}
          sx={{ 
            color: '#ff6f00', 
            fontWeight: 600, 
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.08)' } 
          }}
        >
          Back to My Orders
        </Button>
      </Box>

    
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', mb: 0.5 }}>
          Order Details
        </Typography>
        <Typography variant="body2" sx={{ color: '#888' }}>
          Order ID: <span style={{ color: '#ccc', fontWeight: 600 }}>#{order.id || order._id}</span> | Date: {formattedDate}
        </Typography>
      </Box>

   
      <Paper 
        elevation={0}
        sx={{ 
          bgcolor: '#141414', 
          p: { xs: 3, sm: 4 }, 
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
   
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocalShippingOutlinedIcon sx={{ color: '#ff6f00' }} /> Shipping & Customer Info
          </Typography>
          
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
              gap: 2.5,
              p: 3,
              borderRadius: '14px',
              bgcolor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 0.5 }}>Receiver Name</Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                {order.shippingAddress?.fullName || order.fullName || 'John Doe'}
              </Typography>

              <Typography variant="caption" sx={{ color: '#888', display: 'block', mt: 2, mb: 0.5 }}>Delivery Address</Typography>
              <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                {order.shippingAddress?.address || order.address || 'N/A'}
              </Typography>
              <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                {order.shippingAddress?.city || order.city || 'N/A'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 0.5 }}>Contact Number</Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                {order.shippingAddress?.phone || order.phone || 'N/A'}
              </Typography>

              <Typography variant="caption" sx={{ color: '#888', display: 'block', mt: 2, mb: 0.5 }}>Payment Status ({displayPaymentMethod})</Typography>
              
              <Typography sx={{ color: statusColor, fontWeight: 700, fontSize: '0.95rem' }}>
                {displayPaymentStatus}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 3 }} />

       
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
            Purchased Product
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: 2.5,
              borderRadius: '14px',
              bgcolor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box 
                component="img"
                src={productImage}
                alt={productTitle}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  objectFit: 'contain', 
                  bgcolor: '#fff', 
                  borderRadius: '10px',
                  p: 1,
                  flexShrink: 0
                }}
              />
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', mb: 0.5 }}>
                  {productTitle}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  Unit Price: <strong style={{ color: '#ccc' }}>${productPrice}</strong> | Qty: <strong style={{ color: '#ccc' }}>{productQty}</strong>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>Subtotal</Typography>
              <Typography sx={{ fontWeight: 800, color: '#ff6f00', fontSize: '1.2rem' }}>
                ${totalAmount}
              </Typography>
            </Box>
          </Box>
        </Box>

       
        <Box 
          sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ color: '#aaa', fontWeight: 600 }}>Total Bill Paid:</Typography>
          <Typography sx={{ color: '#ff6f00', fontWeight: 800, fontSize: '1.4rem' }}>
            ${totalAmount}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}