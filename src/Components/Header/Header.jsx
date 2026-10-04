import * as React from 'react';
import { 
  AppBar, Box, Toolbar, Typography, Button, 
  IconButton, Avatar, Menu, MenuItem, Container, InputBase,
  Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider,
  TextField, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { logout, setSearchQuery, getMe } from '../../Pages/features/authenticationSlice/authenticationSlice';

// Dummy products fallback list
const DUMMY_PRODUCTS = [
  { id: 101, title: 'Wireless Bluetooth Headphones', price: 59.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
  { id: 102, title: 'Smart Fitness Watch Series 5', price: 129.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
  { id: 103, title: 'Minimalist Casual Backpack', price: 39.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200' },
  { id: 104, title: 'Classic Stainless Steel Watch', price: 89.50, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200' },
  { id: 105, title: 'Ultra-HD Action Camera 4K', price: 199.00, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200' },
  {
    id: 9901,
    title: "Classic Black Leather Jacket",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9902,
    title: "Minimalist Casual White Sneakers",
    price: 75.50,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9903,
    title: "Modern Wireless Over-Ear Headphones",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9904,
    title: "Smart Fitness Tracking Watch",
    price: 149.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
  },
   {
    id: 9905,
    title: "Elegant Silver Wristwatch",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9906,
    title: "Designer Polarized Sunglasses",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60"
  },
   {
    id: 9907,
    title: "Waterproof Urban Travel Backpack",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9908,
    title: "Casual Cotton Crewneck T-Shirt",
    price: 25.00,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9909,
    title: "Professional DSLR Camera",
    price: 850.00,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9910,
    title: "Compact Portable Bluetooth Speaker",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9911,
    title: "Stunning Diamond Gold Ring",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9912,
    title: "Delicate Pearl Pendant Necklace",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9913,
    title: "Bohemian Chic Summer Dress",
    price: 60.00,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9914,
    title: "Cozy Knit Oversized Sweater",
    price: 70.00,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9915,
    title: "Athletic Running Sports Shoes",
    price: 90.00,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9916,
    title: "Stainless Steel Insulated Water Bottle",
    price: 28.00,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9917,
    title: "Ergonomic Mechanical Gaming Keyboard",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9918,
    title: "High-Precision Wireless Gaming Mouse",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9919,
    title: "Luxury Leather Office Briefcase",
    price: 180.00,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 9920,
    title: "Modern Ceramic Coffee Mug",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60"
  }
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false); 
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Sidebar Search states
  const [isSearchingInDrawer, setIsSearchingInDrawer] = React.useState(false);
  const [drawerSearchText, setDrawerSearchText] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [loadingSearch, setLoadingSearch] = React.useState(false);

  const dispatch = useDispatch();        
  const navigate = useNavigate();        
  const location = useLocation(); 

  const token = useSelector((state) => state.authentication?.token) || localStorage.getItem('token');
  const user = useSelector((state) => state.authentication?.user); 
  const searchQuery = useSelector((state) => state.authentication?.searchQuery || '');

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  React.useEffect(() => {
    if (!user && token) {
      dispatch(getMe());
    }
  }, [dispatch, user, token]);

  // Live searching effect inside sidebar using Fake Store API with Fallback to DUMMY_PRODUCTS
  React.useEffect(() => {
    const controller = new AbortController();

    const fetchDrawerProducts = async () => {
      setLoadingSearch(true);
      let productsList = [];

      try {
        const response = await fetch('https://fakestoreapi.com/products', {
          signal: controller.signal
        });
        const data = await response.json();
        productsList = Array.isArray(data) ? data : [];
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log("API failed or network error, falling back to dummy products.");
        }
      }

      // If API failed, returned empty, or returned no valid items, use fallback dummy products
      if (productsList.length === 0) {
        productsList = DUMMY_PRODUCTS;
      }

      // Filter products based on search input (or show all if input is empty)
      const filtered = productsList.filter(product => {
        const title = product.title || product.name || '';
        return title.toLowerCase().includes(drawerSearchText.toLowerCase());
      });

      setSearchResults(filtered);
      setLoadingSearch(false);
    };

    const timer = setTimeout(fetchDrawerProducts, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [drawerSearchText]);

  const getAvatarUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `https://gocartappbackend-production.up.railway.app${cleanPath}`;
  };

  const getInitials = (nameStr) => {
    if (!nameStr) return 'U';
    return nameStr
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
    if (mobileOpen) {
      setIsSearchingInDrawer(false);
      setDrawerSearchText('');
      setSearchResults([]);
    }
  };

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    handleCloseUserMenu();        
    dispatch(logout());            
    navigate('/login');  
  };

  const handleDirectBuy = (product) => {
    handleDrawerToggle();
    
    const rawPrice = product?.price ?? 0;
    const parsedPrice = typeof rawPrice === 'string' 
      ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) 
      : Number(rawPrice);
    const safePrice = isNaN(parsedPrice) ? 0 : parsedPrice;

    const rawShipping = product?.shipping ?? 0;
    const parsedShipping = typeof rawShipping === 'string' 
      ? parseFloat(rawShipping.replace(/[^0-9.]/g, '')) 
      : Number(rawShipping);
    const safeShipping = isNaN(parsedShipping) ? 0 : parsedShipping;

    navigate('/payment', { 
      state: { 
        product: {
          id: product?.id,
          title: product?.title || product?.name || 'Product',
          price: safePrice,
          image: product?.image || '',
          quantity: 1,
          shipping: safeShipping
        } 
      } 
    });
  };

  const avatarSrc = getAvatarUrl(user?.avatar || user?.profilePic || "");

  const drawerContent = (
    <Box 
      sx={{ 
        width: 300, 
        bgcolor: '#121212', 
        height: '100%', 
        color: '#ffffff', 
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }} 
      role="presentation"
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', flexShrink: 0 }}>
        {isSearchingInDrawer ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <IconButton 
              onClick={() => { setIsSearchingInDrawer(false); setDrawerSearchText(''); }}
              sx={{ color: '#ff6f00', p: 0.5 }}
              aria-label="back to navigation"
            >
              <ArrowBackIcon />
            </IconButton>
            <TextField
              autoFocus
              fullWidth
              placeholder="Search products..."
              value={drawerSearchText}
              onChange={(e) => setDrawerSearchText(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { color: '#ffffff', fontSize: '0.95rem' }
              }}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.08)', 
                px: 1.5, 
                py: 0.5, 
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:focus-within': {
                  borderColor: '#ff6f00 !important',
                  boxShadow: '0 0 0 2px rgba(255, 111, 0, 0.25)',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)'
                },
                '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                  display: 'none !important',
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff !important',
                  WebkitTextFillColor: '#ffffff !important',
                },
                '& input::placeholder': { 
                  color: '#888 !important', 
                  opacity: 1 
                }
              }}
            />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 4px 12px rgba(255, 111, 0, 0.4)'
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ color: '#ffffff', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                Go<span style={{ color: '#ff6f00' }}>Cart</span>
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#aaaaaa' }} aria-label="close drawer">
              <CloseIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Scrollable Container with flexGrow and proper overflow setup */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2, WebkitOverflowScrolling: 'touch' }}>
        {isSearchingInDrawer ? (
          <Box>
            {loadingSearch ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress size={28} sx={{ color: '#ff6f00' }} />
              </Box>
            ) : searchResults.length > 0 ? (
              <List sx={{ p: 0 }}>
                {searchResults.map((product) => (
                  <Box 
                    key={product.id}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '8px', 
                      mb: 1.5, 
                      p: 1,
                      bgcolor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      gap: 1
                    }}
                  >
                    <Box 
                      component={Link}
                      to={`/products/${product.id}`}
                      onClick={handleDrawerToggle}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', overflow: 'hidden', flexGrow: 1 }}
                    >
                      <Avatar 
                        src={product.image} 
                        variant="rounded" 
                        sx={{ width: 40, height: 40, bgcolor: '#fff', objectFit: 'contain', flexShrink: 0 }} 
                      />
                      <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#ff6f00', fontWeight: 700 }}>
                          ${product.price}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      onClick={() => handleDirectBuy(product)}
                      variant="contained"
                      size="small"
                      sx={{ 
                        bgcolor: '#ff6f00',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        minWidth: '55px',
                        py: 0.5,
                        px: 1.5,
                        borderRadius: '6px',
                        flexShrink: 0,
                        '&:hover': { bgcolor: '#e66300' }
                      }}
                    >
                      Buy
                    </Button>
                  </Box>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: '#888', textAlign: 'center', mt: 4 }}>
                No products found.
              </Typography>
            )}
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} 
                to="/" 
                onClick={handleDrawerToggle}
                sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} 
                to="/orders" 
                onClick={handleDrawerToggle}
                sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><ReceiptLongIcon /></ListItemIcon>
                <ListItemText primary="Orders" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => setIsSearchingInDrawer(true)}
                sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><SearchIcon /></ListItemIcon>
                <ListItemText primary="Search" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>

            {token && (
              <>
                <Divider sx={{ my: 1.5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                {isAdmin ? (
                  <>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemButton 
                        component={Link} 
                        to="/admin-profile" 
                        onClick={handleDrawerToggle}
                        sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
                      >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><PersonIcon /></ListItemIcon>
                        <ListItemText primary="Admin Profile" primaryTypographyProps={{ fontWeight: 600 }} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemButton 
                        component={Link} 
                        to="/admin-dashboard" 
                        onClick={handleDrawerToggle}
                        sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
                      >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
                      </ListItemButton>
                    </ListItem>
                  </>
                ) : (
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton 
                      component={Link} 
                      to="/me" 
                      onClick={handleDrawerToggle}
                      sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
                    >
                      <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><PersonIcon /></ListItemIcon>
                      <ListItemText primary="My Profile" primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                  </ListItem>
                )}
              </>
            )}
          </List>
        )}
      </Box>

      {!isSearchingInDrawer && (
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)', flexShrink: 0 }}>
          {token && (
            <ListItemButton 
              onClick={() => { handleLogout(); handleDrawerToggle(); }}
              sx={{ borderRadius: '8px', color: '#ff4d4d', '&:hover': { bgcolor: 'rgba(255, 77, 77, 0.15)' } }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'rgba(17, 17, 17, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '70px !important', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
            
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: { xs: 'none', sm: 'flex' }, 
                alignItems: 'center', 
                textDecoration: 'none'
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                  boxShadow: '0px 4px 14px rgba(255, 111, 0, 0.4)'
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ color: '#ffffff', fontSize: 24 }} />
              </Box>
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: '#ffffff',
                  fontFamily: '"Plus Jakarta Sans", sans-serif, system-ui',
                  '& span': { color: '#ff6f00' }
                }}
              >
                Go<span>Cart</span>
              </Typography>
            </Box>

            {token && (
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, mr: 1 }}>
                <IconButton
                  size="large"
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                  sx={{ color: '#ffffff' }}
                >
                  <MenuIcon />
                </IconButton>

                <Drawer
                  anchor="left"
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  ModalProps={{ keepMounted: true }}
                  sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300, bgcolor: '#121212' },
                  }}
                >
                  {drawerContent}
                </Drawer>
              </Box>
            )}

            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: { xs: 'flex', sm: 'none' }, 
                alignItems: 'center', 
                textDecoration: 'none',
                flexGrow: 1,
                justifyContent: 'flex-end'
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ color: '#ffffff', fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  color: '#ffffff',
                  '& span': { color: '#ff6f00' }
                }}
              >
                Go<span>Cart</span>
              </Typography>
            </Box>

            {token && 
             location.pathname !== '/me' && 
             location.pathname !== '/orders' && 
             location.pathname !== '/payment' &&
             location.pathname !== '/help' && 
             !location.pathname.startsWith('/orders/') && 
             !location.pathname.startsWith('/admin') && (
              <Box 
                component="form" 
                onSubmit={handleSearchSubmit}
                sx={{ 
                  display: { xs: 'none', sm: 'flex' }, 
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.5,
                  flexGrow: 1,
                  maxWidth: '400px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:focus-within': {
                    borderColor: '#ff6f00 !important',
                    boxShadow: '0 0 0 2px rgba(255, 111, 0, 0.25)',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)'
                  },
                  '&:hover': {
                    borderColor: 'rgba(255, 111, 0, 0.5)'
                  }
                }}
              >
                <SearchIcon sx={{ color: '#aaa', mr: 1, fontSize: 20 }} />
                <InputBase
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{ 
                    color: '#ffffff !important', 
                    width: '100%',
                    fontSize: '0.95rem',
                    '& .MuiInputBase-input': {
                      color: '#ffffff !important',
                      WebkitTextFillColor: '#ffffff !important',
                    },
                    '& input::placeholder': { 
                      color: '#888 !important', 
                      opacity: 1 
                    }
                  }}
                />
              </Box>
            )}

          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, ml: 'auto' }}>
            
            {!token && (
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  sx={{ 
                    color: '#dddddd', 
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.92rem',
                    px: 2,
                    borderRadius: '8px',
                    '&:hover': { color: '#ff6f00', bgcolor: 'rgba(255, 111, 0, 0.08)' } 
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  sx={{ 
                    color: '#dddddd', 
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.92rem',
                    px: 2,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}

            {token && (
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: '2px' }} aria-label="account settings">
                  <Avatar 
                    src={avatarSrc} 
                    sx={{ 
                      width: 40,
                      height: 40,
                      bgcolor: '#ff6f00', 
                      color: '#ffffff', 
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {!avatarSrc && getInitials(user?.name || user?.username)}
                  </Avatar>
                </IconButton>

                <Menu
                  sx={{ 
                    mt: '45px', 
                    '& .MuiPaper-root': { 
                      bgcolor: '#1a1a1a', 
                      color: '#ffffff', 
                      borderRadius: '12px',
                      minWidth: '180px',
                      boxShadow: '0px 10px 30px rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '4px'
                    } 
                  }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {isAdmin ? (
                    <>
                      <MenuItem 
                        component={Link} 
                        to="/admin-profile" 
                        onClick={handleCloseUserMenu}
                        sx={{ borderRadius: '8px', my: '2px', fontSize: '0.92rem', fontWeight: 500, '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
                      >
                        Admin Profile
                      </MenuItem>
                      <MenuItem 
                        component={Link} 
                        to="/admin-dashboard" 
                        onClick={handleCloseUserMenu}
                        sx={{ borderRadius: '8px', my: '2px', fontSize: '0.92rem', fontWeight: 500, '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
                      >
                        Admin Dashboard
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem 
                        component={Link} 
                        to="/me" 
                        onClick={handleCloseUserMenu}
                        sx={{ borderRadius: '8px', my: '2px', fontSize: '0.92rem', fontWeight: 500, '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
                      >
                        My Profile
                      </MenuItem>
                      <MenuItem 
                        component={Link} 
                        to="/orders" 
                        onClick={handleCloseUserMenu}
                        sx={{ borderRadius: '8px', my: '2px', fontSize: '0.92rem', fontWeight: 500, '&:hover': { bgcolor: 'rgba(255, 111, 0, 0.15)', color: '#ff6f00' } }}
                      >
                        Orders
                      </MenuItem>
                    </>
                  )}
                  <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ borderRadius: '8px', my: '2px', fontSize: '0.92rem', fontWeight: 500, color: '#ff4d4d', '&:hover': { bgcolor: 'rgba(255, 77, 77, 0.15)' } }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}

          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}