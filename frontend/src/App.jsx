import React from 'react';
import { Outlet } from 'react-router';
// import navigation from "./pages/auth/navigation"

const App =()=>{
    return (
        <>
        <main className="py-3">
            <Outlet/>
            </main></>
    )
}

export default App