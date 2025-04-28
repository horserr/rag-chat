import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import React from "react";
import "./home.css"
import MenuIcon from '@mui/icons-material/Menu';
import {blue} from '@mui/material/colors';
import {theme} from '../theme';

export function Home(prop: {setToken : Function}) {
    return (
        <Box sx={{ flexGrow: 1 }} margin={0} padding={0}>
        <AppBar position="static" className="appbar" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar>
            <IconButton >
                <MenuIcon sx = {{color: theme.palette.primary.contrastText}}/>
            </IconButton>
          </Toolbar>
            
        </AppBar>
        </Box>
    );
}