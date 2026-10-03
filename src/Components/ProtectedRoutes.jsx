import React from 'react'
import { Navigate, Outlet } from "react-router"
import { useSelector } from "react-redux"

function ProtectedRoutes() {
    
   
      const token = useSelector(state => state?.authentication?.token) || localStorage.getItem("token")

    if (!token) {
        return <Navigate to={"/login"} replace />
    }

    return <Outlet />
}

export default ProtectedRoutes