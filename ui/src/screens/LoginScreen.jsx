import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Alert,
  Box, 
  Button, 
  Card, 
  CircularProgress, 
  Container, 
  Divider, 
  IconButton, 
  InputAdornment, 
  Snackbar, 
  Stack, 
  TextField, 
  Typography 
} from "@mui/material";
import VisibilityOn from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";
import { useAuth } from "../contexts/Auth";
import ValidationUtils from "../utils/ValidationUtils";

const LoginScreen = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [ alertMessage, setAlertMessage ] = useState('');
  const [ isPasswordError, setIsPasswordError ] = useState(false);
  const [ isUsernameError, setIsUsernameError ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ openAlert, setOpenAlert ] = useState(false);
  const [ password, setPassword ] = useState('');
  const [ passwordErrorText, setPasswordErrorText ] = useState('');
  const [ severity, setSeverity ] = useState('success');
  const [ showPassword, setShowPassword ] = useState(false);
  const [ username, setUsername ] = useState('');
  const [ usernameErrorText, setUsernameErrorText ] = useState('');

  const handleCloseAlert = () => {
    setOpenAlert(false);
  }

  const handleLogin = async () => {
    const conditions = [
      {
        value: username,
        setError: setIsUsernameError,
        setErrorText: setUsernameErrorText,
        errorMessage: "Please enter username"
      },
      {
        value: password,
        setError: setIsPasswordError,
        setErrorText: setPasswordErrorText,
        errorMessage: "Please enter password"
      }
    ];

    const errorMessages = ValidationUtils.validateInputs(conditions);
    if (errorMessages.length > 0) {
      return;
    }

    const payload = {
      username: username,
      password: password
    }

    setLoading(true);

    await ServerCommunicationUtils.postNoAuth('auth/login', payload)
    .then(data => {
      if (data.status === 200) {
        setLoading(false);
        setOpenAlert(true);
        setSeverity('success');
        setAlertMessage('Login successful');
        login(data.content.token);
        navigate("/dashboard");
      } else if (data.status === 400) {
        setLoading(false);
        setOpenAlert(true);
        setSeverity('error');
        setAlertMessage('Invalid credentials provided');
      }
    })
    .catch(error => {
      console.error("Error:", error);
      setLoading(false);
      setOpenAlert(true);
      setSeverity('error');
      if (error.toString().includes('NetworkError when attempting to fetch resource')) {
        setAlertMessage('Please check your internet connection');
      } else {
        setAlertMessage('Error logging in');
      }
    })
  }

  const handlePasswordChange = (event) => {
    const passwordValue = event.target.value;
    setPassword(passwordValue);
    setIsPasswordError(false);
  }

  const handleUsernameChange = (event) => {
    const usernameValue = event.target.value;
    setUsername(usernameValue);
    setIsUsernameError(false);
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }

  const showAlert = () => {
    return (
      <Snackbar 
        open={openAlert} 
        autoHideDuration={7000} 
        onClose={handleCloseAlert} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} variant="filled" severity={severity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <Card sx={{ p:5, width: "100%" }}>
          <Typography variant="h5" sx={{ textAlign: "center", mt: 2}}>Viraj Outfits</Typography>
          <Divider sx={{ my: 4 }} />
          <Stack spacing={3}>
            <TextField
              name="username"
              label="Username"
              error={isUsernameError}
              helperText={isUsernameError ? usernameErrorText : ''}
              variant="outlined"
              margin="normal"
              required
              id="username"
              value={username}
              onChange={handleUsernameChange}
              InputProps={{
                sx: { borderRadius: 5, fontSize: '12px' }
              }}
            />
            <TextField
              name="password"
              label="Password"
              error={isPasswordError}
              helperText={isPasswordError ? passwordErrorText : ''}
              variant="outlined"
              margin="normal"
              required
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={handlePasswordChange}
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
      {showAlert()}
    </Container>
  );
}

export default LoginScreen;