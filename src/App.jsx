import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { HelpCentre, OrderDetail, OrdersPage, PaymentPage, } from './Pages';
import { Homepage, Login, Register } from './Pages';
import './App.css';
import { Provider, useSelector, useDispatch } from "react-redux"; 
import { store } from "./Store/store";
import Profile from "./Pages/Profile/Profile";
import AdminProfile from "./Pages/adminProfile/AdminProfile";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import AdminDashboard from './Pages/adminDashboard/AdminDashboard'; 
import { getMe } from './Pages/features/authenticationSlice/authenticationSlice'; 
import { Box, CircularProgress } from '@mui/material';
import { PublicContainer } from './Components';


function AdminRouteWrapper({ children }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const user = useSelector(state => state.authentication.user);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdminUser = async () => {
    
      if (token && !user) {
        try {
          await dispatch(getMe()).unwrap();
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
      setLoading(false);
    };

    verifyAdminUser();
  }, [dispatch, token, user]);

  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#111' }}>
        <CircularProgress sx={{ color: '#ff6f00' }} />
      </Box>
    );
  }


  const isAdmin = user?.role === 'admin' || user?.role === 'Admin';
  if (!token || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: PublicContainer,
      children: [
        {
          index: true,
          element: localStorage.getItem('token') ? <Homepage /> : <Register />
        },
        {
          path: "home",      
          Component: Homepage
        },
        {
          path: "help",
          Component: HelpCentre
        },
        {
          path: "register",
          Component: Register
        },
        {
          path: "login",
          Component: Login
        },
        {
          path: "profile",
          Component: Profile
        },
        {
          path: "orders", 
          Component: OrdersPage
        },
        {
          path: "orders/:id", 
          Component: OrderDetail
        }, 
        {
          path: "payment", 
          Component: PaymentPage
        },
        {
          path: "me",
          Component: ProtectedRoutes,
          children:[          
            {
              index: true,
              Component: Profile
            }
          ]
        },
       
        {
          path: "admin-profile",
          element: <AdminRouteWrapper><AdminProfile /></AdminRouteWrapper>
        },
       
        {
          path: "admin-dashboard",
          element: <AdminRouteWrapper><AdminDashboard /></AdminRouteWrapper>
        }
      ]
    }
  ]);

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </>
  );
}

export default App;