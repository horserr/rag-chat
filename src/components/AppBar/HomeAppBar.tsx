import { useState } from "react";
import { AppBar, Box, IconButton, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Logout } from "@mui/icons-material";
import { theme } from '../../theme';

export function HomeAppBar(prop: { setToken: Function }) {
    // State to manage the user menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Handler for opening the menu
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Handler for closing the menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handler for logout
    const handleLogout = () => {
        // Close the menu
        handleMenuClose();
        // Set token to null to log out
        prop.setToken(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }} margin={0} padding={0}>
            <AppBar position="static" className="appbar" sx={{ backgroundColor: theme.palette.primary.main }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        color="inherit"
                        sx={{ mr: 2, fontSize: '2rem' }}
                    >
                        <MenuIcon sx={{ fontSize: '2rem' }} />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        南京大学 RAG 问答平台
                    </Typography>

                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account"
                        aria-controls={open ? 'user-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleMenuOpen}
                        color="inherit"
                        sx={{ fontSize: '2rem' }}
                    >
                        <AccountCircle sx={{ fontSize: '2rem' }} />
                    </IconButton>

                    {/* User Menu */}
                    <Menu
                        id="user-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        MenuListProps={{
                            'aria-labelledby': 'user-button',
                        }}
                    >
                        <MenuItem onClick={handleLogout}>
                            <Logout sx={{ mr: 1 }} />
                            退出登录
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </Box>
    );
}