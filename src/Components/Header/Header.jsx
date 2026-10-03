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
import { Link, useNavigate, useLocation } from 'react-router'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { logout, setSearchQuery, getMe } from '../../Pages/features/authenticationSlice/authenticationSlice';

export default function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false); 
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Sidebar Search states
  const [isSearchingInDrawer, setIsSearchingInDrawer] = React.useState(false);
  const [drawerSearchText, setDrawerSearchText] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [loadingSearch, setLoadingSearch] = React.useState(false);

  const dispatch = useDispatch();        
  const useNavigateInstance = useNavigate();        
  const location = useLocation(); 

  const token = useSelector((state) => state.authentication?.token) || localStorage.getItem('token');
  const user = useSelector((state) => state.authentication?.user); 
  const searchQuery = useSelector((state) => state.authentication?.searchQuery || '');

  const isAdmin = user?.role === 'admin' || user?.role === 'Admin';

  React.useEffect(() => {
    if (!user && token) {
      dispatch(getMe());
    }
  }, [dispatch, user, token]);

  // Live searching effect inside sidebar using Fake Store API
  React.useEffect(() => {
    const fetchDrawerProducts = async () => {
      if (!drawerSearchText.trim()) {
        setSearchResults([]);
        return;
      }
      setLoadingSearch(true);
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        
        const productsList = Array.isArray(data) ? data : [];

        // Filter products based on user's typing
        const filtered = productsList.filter(product => {
          const title = product.title || product.name || '';
          return title.toLowerCase().includes(drawerSearchText.toLowerCase());
        });

        setSearchResults(filtered);
      } catch (err) {
        console.error("Error fetching fake api products:", err);
      } finally {
        setLoadingSearch(false);
      }
    };

    const timer = setTimeout(fetchDrawerProducts, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [drawerSearchText]);

  const getAvatarUrl = (path) => {
    if (!path) return "";

    if (path.startsWith("http") || path.startsWith("blob")) {
      return path;
    }

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
    setMobileOpen(!mobileOpen);
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
      useNavigateInstance(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    handleCloseUserMenu();        
    dispatch(logout());            
    useNavigateInstance('/login');  
  };

  // Helper function to handle direct buy safely with complete number sanitization
  const handleDirectBuy = (product) => {
    handleDrawerToggle();
    
    // 1. Safe Price Parsing
    const rawPrice = product?.price ?? 0;
    const parsedPrice = typeof rawPrice === 'string' 
      ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) 
      : Number(rawPrice);
    const safePrice = isNaN(parsedPrice) ? 0 : parsedPrice;

    // 2. Safe Shipping Parsing
    const rawShipping = product?.shipping ?? 0;
    const parsedShipping = typeof rawShipping === 'string' 
      ? parseFloat(rawShipping.replace(/[^0-9.]/g, '')) 
      : Number(rawShipping);
    const safeShipping = isNaN(parsedShipping) ? 0 : parsedShipping;

    useNavigateInstance('/payment', { 
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

  // Sidebar Drawer Content for Mobile Only
  const drawerContent = (
    <Box 
      sx={{ 
        width: 300, 
        bgcolor: '#121212', 
        height: '100%', 
        color: '#ffffff', 
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box'
      }} 
      role="presentation"
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {isSearchingInDrawer ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <IconButton 
              onClick={() => { setIsSearchingInDrawer(false); setDrawerSearchText(''); setSearchResults([]); }}
              sx={{ color: '#ff6f00', p: 0.5 }}
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
                transition: 'all 0.3s ease',
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
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#aaaaaa' }}>
              <CloseIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Navigation Links or Live Search Products List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2 }}>
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
                    {/* Clickable area to view product details */}
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

                    {/* Buy Button -> Navigates to Payment */}
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
            ) : drawerSearchText.trim() ? (
              <Typography variant="body2" sx={{ color: '#888', textAlign: 'center', mt: 4 }}>
                No products found.
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: '#888', textAlign: 'center', mt: 4 }}>
                Type to search items...
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

            {/* Search Tab Click Trigger */}
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

      {/* Bottom Footer Actions inside Sidebar */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
          
          {/* Left Side: Logo & Search Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
            
            {/* Logo & Brand Name (Desktop & Tablet) */}
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

            {/* 📱 Mobile Only Sidebar Trigger Icon (Only visible when logged in / token exists) */}
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
                  ModalProps={{
                    keepMounted: true, 
                  }}
                  sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300, bgcolor: '#121212' },
                  }}
                >
                  {drawerContent}
                </Drawer>
              </Box>
            )}

            {/* Logo & Brand Name (Mobile Only - pushed right via flexGrow: 1) */}
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: { xs: 'flex', sm: 'none' }, 
                alignItems: 'center', 
                textDecoration: 'none',
                flexGrow: 1,
                justify5Content: 'flex-end',
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

            {/* Search Bar (Desktop & Tablet) */}
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

          {/* Right Side: Profile / Auth Actions */}
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
                <IconButton onClick={handleOpenUserMenu} sx={{ p: '2px' }}>
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