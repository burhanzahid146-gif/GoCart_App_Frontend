import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  Paper,
  Divider,
  Alert,
  TextField,
  Grid 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../Services/api';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  const user = useSelector((state) => state.authentication?.user);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

 
  useEffect(() => {
    if (user) {
      setShippingInfo({
        fullName: user.name || user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

 const handleConfirmPayment = async () => {
   
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone || !shippingInfo.city) {
      setErrorMsg('Please fill in all required shipping details.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      let itemsPayload = [];
    let calculatedTotal = 0;

    if (Array.isArray(orderData)) {
      itemsPayload = orderData.map(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        calculatedTotal += itemTotal;
        return {
          title: item.title || item.productTitle,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image || item.productImage || item.thumbnail
        };
      });
    } else if (orderData?.items && Array.isArray(orderData.items)) {
      itemsPayload = orderData.items.map(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        calculatedTotal += itemTotal;
        return {
          title: item.title || item.productTitle,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image || item.productImage || item.thumbnail 
        };
      });
    } else {
      calculatedTotal = (orderData?.price || 0) * (orderData?.quantity || 1);
      itemsPayload = [{
        title: orderData?.productTitle || orderData?.title,
        price: orderData?.price,
        quantity: orderData?.quantity || 1,
        image: orderData?.image || orderData?.productImage || orderData?.thumbnail 
      }];
    }

    const checkoutPayload = {
      items: itemsPayload, 
      totalAmount: calculatedTotal,
      paymentMethod: paymentMethod,
      status: 'Success',
      shippingAddress: {
        fullName: shippingInfo.fullName, 
        email: shippingInfo.email,
        address: shippingInfo.address,
        city: shippingInfo.city,
        phone: shippingInfo.phone
      }
    };
       
      console.log("SENDING TO BACKEND ->", checkoutPayload);
      const response = await api.post('/orders', checkoutPayload);

      if (response.status === 201 || response.data?.success) {
        alert(`Order Placed Successfully! 🎉`);
        navigate('/', { replace: true });
      } else {
        setErrorMsg("Order created, but response format was unexpected.");
      }

    } catch (err) {
      console.error("Checkout error:", err);
      setErrorMsg(err.response?.data?.message || 'Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center', color: '#fff' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>No active checkout session found.</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/orders')} 
          sx={{ bgcolor: '#ff6f00', fontWeight: 600, textTransform: 'none' }}
        >
          Return to Orders
        </Button>
      </Container>
    );
  }

  const displayTotal = orderData?.totalAmount || (Array.isArray(orderData) ? orderData.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0) : (orderData?.price * (orderData?.quantity || 1)));

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper 
        elevation={0}
        sx={{ 
          bgcolor: '#141414', 
          p: { xs: 3, sm: 5 }, 
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          color: '#fff'
        }}
      >
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            Checkout & Shipping
          </Typography>
          <LockOutlinedIcon sx={{ color: '#4caf50', fontSize: 20 }} />
        </Box>

        {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{errorMsg}</Alert>}

        <Grid container spacing={4}>
        
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle2" sx={{ color: '#ff6f00', mb: 2, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonOutlineOutlinedIcon fontSize="small" /> Shipping Details
            </Typography>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                label="Full Name" 
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
                sx={textFieldStyles}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Email Address" 
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Phone Number" 
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    size="small"
                    sx={textFieldStyles}
                  />
                </Grid>
              </Grid>
              <TextField 
                label="Delivery Address (Street, House #, Area)" 
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                required
                fullWidth
                multiline
                rows={2}
                size="small"
                sx={textFieldStyles}
              />
              <TextField 
                label="City" 
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
                sx={textFieldStyles}
              />
            </Box>
          </Grid>

        
          <Grid item xs={12} md={5}>
            <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="subtitle2" sx={{ color: '#888', mb: 1, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
                Order Summary
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.5 }}>
                {orderData.productTitle || orderData.title || (Array.isArray(orderData) ? `${orderData.length} Items in Cart` : 'Cart Checkout Items')}
              </Typography>
              <Typography sx={{ color: '#aaa', fontSize: '0.85rem' }}>
                {orderData.quantity ? `Quantity: ${orderData.quantity}` : (Array.isArray(orderData) ? 'Multiple Items' : 'Cart Session')}
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ color: '#aaa', fontSize: '0.9rem' }}>Total Amount</Typography>
                <Typography sx={{ fontWeight: 800, color: '#ff6f00', fontSize: '1.25rem' }}>
                  ${displayTotal}
                </Typography>
              </Box>

             
              <Typography variant="subtitle2" sx={{ color: '#888', mb: 1.5, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
                Payment Method
              </Typography>
              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Box 
                    onClick={() => setPaymentMethod('cod')}
                    sx={{ 
                      p: 1.5, mb: 1, borderRadius: '10px', cursor: 'pointer',
                      bgcolor: paymentMethod === 'cod' ? 'rgba(255, 111, 0, 0.08)' : 'rgba(255,255,255,0.02)',
                      border: paymentMethod === 'cod' ? '1px solid #ff6f00' : '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    <FormControlLabel 
                      value="cod" 
                      control={<Radio sx={{ color: '#ff6f00', '&.Mui-checked': { color: '#ff6f00' } }} />} 
                      label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem', fontWeight: 600 }}><LocalShippingOutlinedIcon fontSize="small" sx={{ color: '#ff6f00' }} /> COD</Box>} 
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Box>

                  <Box 
                    onClick={() => setPaymentMethod('card')}
                    sx={{ 
                      p: 1.5, borderRadius: '10px', cursor: 'pointer',
                      bgcolor: paymentMethod === 'card' ? 'rgba(255, 111, 0, 0.08)' : 'rgba(255,255,255,0.02)',
                      border: paymentMethod === 'card' ? '1px solid #ff6f00' : '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    <FormControlLabel 
                      value="card" 
                      control={<Radio sx={{ color: '#ff6f00', '&.Mui-checked': { color: '#ff6f00' } }} />} 
                      label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem', fontWeight: 600 }}><CreditCardOutlinedIcon fontSize="small" sx={{ color: '#ff6f00' }} /> Card</Box>} 
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>

              
              <Button 
                variant="contained" 
                fullWidth
                disabled={loading}
                onClick={handleConfirmPayment}
                sx={{ 
                  bgcolor: '#ff6f00', 
                  fontWeight: 700, 
                  py: 1.4, 
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(255, 111, 0, 0.4)',
                  '&:hover': { bgcolor: '#e56200', boxShadow: '0 6px 18px rgba(255, 111, 0, 0.5)' } 
                }}
              >
                {loading ? 'Processing...' : `Place Order ($${displayTotal})`}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}


const textFieldStyles = {
  '& .MuiInputBase-root': {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 111, 0, 0.5)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ff6f00',
  },
  '& .MuiInputLabel-root': {
    color: '#aaa',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ff6f00',
  }
};