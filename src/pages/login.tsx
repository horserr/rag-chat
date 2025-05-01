import React from "react";
import Card from '@mui/material/Card';
import { Button, Grid, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import { AuthService } from "../services/auth_service";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Result } from "../models/result";
import { useNavigate } from "react-router-dom";
import "@styles/pages/Login.css";

export function Login(prop : {
    setToken: Function
}) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false)

    const authService = new AuthService();
    const navigate = useNavigate();

    let handle_login = () => {
        let result = authService.login({
            email,
            password
        });

        result.then((body : Result<any>) => {
            switch (body.status_code) {
                case 400:
                    alert(body.message)
                    break
                case 200:
                    let token = body.data
                    // Use setToken from props which now handles expiration
                    prop.setToken(token)
                    navigate("/")
                    break
                default:
                    alert("Server error: \n" + body.message)
            }
        }).catch(e => {
            console.log(e)
        })
    }


    return (
        <Grid sx={{ height: "100vh" }} container justifyContent="center" alignItems="center" >
            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                <Card className="login-card" >
                    <Grid spacing={2} container direction="column" >
                        <Grid>
                            <h1 className="title">Login</h1>
                        </Grid>

                        <Grid>
                            <InputLabel htmlFor="user">Email</InputLabel>
                            <Input
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        <Grid>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={
                                        _ => {
                                            setShowPassword(!showPassword)
                                        }
                                    }
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </Grid>

                        <Grid container justifyContent="right">
                            <Button variant="outlined" onClick={handle_login}>Login</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}