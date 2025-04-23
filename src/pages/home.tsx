import { Button } from "@mui/material";
import React from "react";


export function Home(prop: {setToken : Function}) {
    return (
        <div>
        <h1>Home Page</h1>
        <p>Welcome to the home page!</p>
        <Button onClick={
            () => {
                prop.setToken(null)
                localStorage.removeItem("token")
            }
        }>Logout</Button>
        </div>
    );
}