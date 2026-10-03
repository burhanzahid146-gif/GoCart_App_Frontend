import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, 
  Accordion, AccordionSummary, AccordionDetails, 
  Button, Paper, Alert 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import axios from 'axios';

export default function HelpCentre() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

 
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  
  const faqs = [
    {
      question: "How can I register my account?",
      answer: "Go to the signup/register page, enter your details (name, email, password), and click the Register button to create your account."
    },
    {
      question: "I have placed an order, how can I check its status?",
      answer: "You can visit your 'Orders' page to view the live status of all your active and past orders."
    },
    {
      question: "What payment methods are available?",
      answer: "We offer Credit/Debit Card, JazzCash, EasyPaisa, and Cash on Delivery (COD) options."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "Click on the 'Forgot Password' option on the login page, and a reset link will be sent to your email to set a new password."
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/support', formData);
      
      if (response.status === 201 || response.data.success) {
        setSuccessMsg('Your query/problem has been submitted successfully! We will contact you soon.');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const textFieldStyles = {
    bgcolor: '#1a1a1a',
    borderRadius: 1,
    input: { color: '#fff' },
    textarea: { color: '#fff' },
    '& .MuiInputLabel-root': { color: '#aaa' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6f00' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#555' },
      '&.Mui-focused fieldset': { borderColor: '#ff6f00' },
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6, color: '#fff' }}>
  
      <Box sx={{ textAlign: 'center', mb: 6 }}> 
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Help Centre
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find answers to common questions or submit your query directly below.
        </Typography>
      </Box>

     
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          Frequently Asked Questions (FAQs)
        </Typography>
        
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ bgcolor: '#1a1a1a', color: '#fff', mb: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#ff6f00' }} />}>
              <Typography fontWeight="500">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      
      <Paper elevation={3} component="form" onSubmit={handleSubmit} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: 2, border: '1px solid #333' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <SupportAgentIcon sx={{ color: '#ff6f00', fontSize: 30 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>
            Submit Your Problem Directly
          </Typography>
        </Box>

        {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none' }}
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none' }}
          />
          <textarea 
            name="message" 
            placeholder="Your Problem / Query" 
            rows={4} 
            value={formData.message} 
            onChange={handleChange} 
            required 
            style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none', resize: 'vertical' }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ 
              bgcolor: '#ff6f00', 
              '&:hover': { bgcolor: '#e65100' }, 
              py: 1.5, 
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Problem'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}