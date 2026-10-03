import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header/Header'
import Footer from './Footer/Footer'


function Root() {
  return (
    <>    
    <Headers></Headers>
    <Outlet></Outlet>
    <Footer></Footer>
    </>
  )
}

export default Root