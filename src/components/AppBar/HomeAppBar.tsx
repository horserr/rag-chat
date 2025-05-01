import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from "@mui/icons-material";
import {theme} from '../../theme';

export function HomeAppBar(prop: {setToken : Function}) {
    return (
        <Box sx={{ flexGrow: 1 }} margin={0} padding={0}>
        <AppBar position="static" className="appbar" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar>
            <IconButton size="large" edge="start" aria-label="menu" color="inherit" sx={{ mr: 2, fontSize: '2rem' }} >
              <MenuIcon sx={{ fontSize: '2rem' }} />
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              南京大学 RAG 问答平台
            </Typography>

            <IconButton size="large" edge="end" aria-label="account" color="inherit" sx={{ fontSize: '2rem' }} >
              <AccountCircle sx={{ fontSize: '2rem' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        </Box>
    );
}