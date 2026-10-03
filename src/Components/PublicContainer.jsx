import React from 'react'
import Header from '../Components/Header/Header'
import { Outlet } from 'react-router'




function PublicContainer() {
  return (
   <>
    
    <Header></Header>
    <Outlet></Outlet>
    
   </>
  )
}

export default PublicContainer