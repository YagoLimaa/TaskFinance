"use client";

import { UserContextProvider } from "../context/UserContext";
import React from 'react';


interface UserProviderProps {
    children: React.ReactNode;
}

function UserProvider({children}: UserProviderProps){
    return <UserContextProvider>  {children}  </UserContextProvider>
}

export default UserProvider