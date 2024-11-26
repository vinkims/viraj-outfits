import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Card, 
  CircularProgress, 
  Container, 
  Divider, 
  IconButton, 
  InputAdornment,  
  Stack, 
  TextField 
} from "@mui/material";
import VisibilityOn from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAlert } from "../contexts/AlertContext";
import { useAuth } from "../contexts/Auth";
import { useUser } from "../contexts/UserContext";
import { darkLogo } from "../assets";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const LoginScreen = () => {
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const initialLoginForm = {
    username: '',
    password: ''
  };
  const initialLoginFormErrors = {
    username: false,
    password: false
  };
  const [ loading, setLoading ] = useState(false);
  const [ loginForm, setLoginForm ] = useState(initialLoginForm);
  const [ loginFormErrors, setLoginFormErrors ] = useState(initialLoginFormErrors);
  const [ showPassword, setShowPassword ] = useState(false);

  const getUser = async (token) => {
    const decodedToken = jwtDecode(token);
    let userId = decodedToken.userId;

    await ServerCommunicationUtils.get(`user/${userId}`)
    .then(resp => {
      if (resp.status === 200) {
        const userDetails = {
          firstName: resp.content.firstName,
          lastName: resp.content.lastName,
          userId: resp.content.id,
          role: resp.content.role,
          email: resp.content.contacts,
          status: resp.content.status
        };
        updateUser(userDetails);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    })
  }

  const handleInputChange = (field) => (event) =>{
    const value = event.target.value;
    setLoginForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setLoginFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));
  }

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      username: loginForm.username,
      password: loginForm.password
    }

    setLoading(true);

    await ServerCommunicationUtils.postNoAuth('auth/login', payload)
    .then(data => {
      if (data.status === 200) {
        setLoading(false);
        showAlert('Login successful', 'success');
        login(data.content.token);
        getUser(data.content.token);
        navigate("/dashboard");
      } else if (data.status === 400) {
        setLoading(false);
        showAlert('Invalid credentials provided', 'error');
      }
    })
    .catch(error => {
      console.error("Error:", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection'
        : 'Error logging in';
      showAlert(alertMsg, 'error');
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }

  const validateForm = () => {
    const errors = {};

    if (!loginForm.username) {
      errors.username = true;
    }
    if (!loginForm.password) {
      errors.password = true;
    }

    setLoginFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <Card sx={{ p:5, width: "100%" }}>
          <Box>
            <img src={darkLogo} alt="logo" style={{ height: "auto", width: "100%" }} />
          </Box>
          <Divider sx={{ my: 4 }} />
          <Stack spacing={3}>
            <TextField
              name="username"
              label="Username"
              error={loginFormErrors.username}
              helperText={loginFormErrors.username && 'Please enter username'}
              variant="outlined"
              margin="normal"
              required
              id="username"
              value={loginForm.username}
              onChange={handleInputChange('username')}
              InputProps={{
                sx: { borderRadius: 5, fontSize: '12px' }
              }}
              InputLabelProps={{
                sx: { fontSize: '14px' }
              }}
            />
            <TextField
              name="password"
              label="Password"
              error={loginFormErrors.password}
              helperText={loginFormErrors.password && 'Please enter password'}
              variant="outlined"
              margin="normal"
              required
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={loginForm.password}
              onChange={handleInputChange('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <VisibilityOn /> }
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 5, fontSize: '12px' }
              }}
              InputLabelProps={{
                sx: { fontSize: '14px' }
              }}
            />
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress color="success" />
              </Box>
            ) : (
              <Button
                variant="contained"
                color="inherit"
                sx={{
                  bgcolor: '#FF6E33',
                  color: 'white',
                  borderRadius: 20,
                  "&:hover": {
                    color: 'black'
                  }
                }}
                onClick={handleLogin}
              >Login</Button>
            )}
          </Stack>
        </Card>
      </Box>
    </Container>
  );
}

export default LoginScreen;