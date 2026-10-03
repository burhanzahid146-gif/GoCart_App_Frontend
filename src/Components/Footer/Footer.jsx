import * as React from 'react';
import { Box, Container, Grid, Typography, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#111111', color: '#ffffff', pt: 6, pb: 4, mt: 'auto', borderTop: '4px solid #ff6f00' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5} justifyContent="space-between">
          
          {/* Column 1: Brand & Bio */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalMallIcon sx={{ color: '#ff6f00', fontSize: 32, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '.05rem', color: '#ffffff' }}>
                Go<span style={{ color: '#ff6f00' }}>Cart</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#aaaaaa', mb: 3, lineHeight: 1.6, fontSize: '0.9rem', maxWidth: '400px' }}>
              Your ultimate destination for quality products, seamless shopping, and lightning-fast delivery. Experience retail redefined.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton sx={{ bgcolor: '#222222', color: '#ff6f00', '&:hover': { bgcolor: '#ff6f00', color: '#ffffff' }, transition: '0.3s' }} size="small">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ bgcolor: '#222222', color: '#ff6f00', '&:hover': { bgcolor: '#ff6f00', color: '#ffffff' }, transition: '0.3s' }} size="small">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ bgcolor: '#222222', color: '#ff6f00', '&:hover': { bgcolor: '#ff6f00', color: '#ffffff' }, transition: '0.3s' }} size="small">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton sx={{ bgcolor: '#222222', color: '#ff6f00', '&:hover': { bgcolor: '#ff6f00', color: '#ffffff' }, transition: '0.3s' }} size="small">
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Column 2: Customer Support (Only Help Center & Track Order) */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#ffffff', fontSize: '1rem' }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Typography 
                component={Link} 
                to="/help" 
                sx={{ color: '#aaaaaa', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#ff6f00' } }}
              >
                Help Center
              </Typography>
              <Typography 
                component={Link} 
                to="/orders" 
                sx={{ color: '#aaaaaa', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#ff6f00' } }}
              >
                Track Order
              </Typography>
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4, borderColor: '#222222' }} />

        {/* Bottom Bar */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#888888', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Go Cart. All Rights Reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography component="a" href="#privacy" sx={{ color: '#888888', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#ff6f00' } }}>Privacy Policy</Typography>
            <Typography component="a" href="#terms" sx={{ color: '#888888', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#ff6f00' } }}>Terms of Service</Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}