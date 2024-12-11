import React, { useEffect, useState } from "react";
import { 
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { styled } from "@mui/system";

import { Loading } from "../components";
import { useAlert } from "../contexts/AlertContext";
import { useAuth } from "../contexts/Auth";
import { useUser } from "../contexts/UserContext";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)"
}));

const ProfileScreen = () => {
  const { logout } = useAuth();
  const { showAlert } = useAlert();
  const { user } = useUser();
  const initialUserForm = {
    firstName: '',
    lastName: '',
    email: ''
  };
  const [ loading, setLoading ] = useState(false);
  const [ userDetails, setUserDetails ] = useState(initialUserForm);
  const [ newUserDetails, setNewUserDetails ] = useState(initialUserForm);

  useEffect(() => {
    getUser();
  }, []);

  const getUpdatedFields = () => {
    const updatedFields = {};

    if (newUserDetails.firstName != userDetails.firstName) {
      updatedFields.firstName = newUserDetails.firstName;
    }
    if (newUserDetails.lastName != userDetails.lastName) {
      updatedFields.lastName = newUserDetails.lastName;
    }
    if (newUserDetails.email != userDetails.email) {
      updatedFields.email = newUserDetails.email;
    }

    return updatedFields;
  }

  const getUser = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get(`user/${user.userId}`)
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        const userData = res.content;
        setUserDetails({
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          email: userData.contacts?.[0].value
        });
        setNewUserDetails({
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          email: userData.contacts?.[0].value
        });
      } else if (res.status === 403) {
        logout();
      } else if (res.status === 404) {
        setLoading(false);
        showAlert("User not found", 'error');
      } else {
        setLoading(false);
        const alertMsg = res.status === 500
          ? "Error getting user. Try again later."
          : res.detail;
        showAlert(alertMsg, "error");
      }
    })
    .catch(error => {
      console.error("Error", error);
      setLoading(false);
      let alertMsg = error.toString().includes("NetworkError when attempting to fetch resource")
        ? "Please check your internet connection."
        : "Error getting user.";
      showAlert(alertMsg, "error");
    })
  }

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setNewUserDetails((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
  }

  const handleSaveUser = async () => {
    const updatedFields = getUpdatedFields();

    if (Object.keys(updatedFields).length === 0) {
      showAlert("No changes detected", "info");
      return;
    }
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: "50px" }}>
      <StyledPaper>
        <Grid item xs={12}>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 600 }}>Profile</Typography>
        </Grid>
        <Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <TextField
              margin="dense"
              label="First Name"
              name="firstName"
              required
              sx={{ flex: 1 }}
              value={newUserDetails.firstName}
              onChange={handleInputChange('firstName')}
            />
            <TextField
              margin="dense"
              label="Last Name"
              name="lastName"
              required
              sx={{ flex: 1, marginLeft: "10px" }}
              value={newUserDetails.lastName}
              onChange={handleInputChange('lastName')}
            />
          </Box>
          <TextField
            margin="dense"
            label="Email"
            name="email"
            disabled
            required
            fullWidth
            value={newUserDetails.email}
            onChange={handleInputChange('email')}
          />
        </Box>
        <Box display="flex" justifyContent="center" width="100%">
          <Button
            variant="contained"
            color="inherit"
            sx={{
              bgcolor: "#FF6E33",
              color: "white",
              marginTop: "10px",
              "&:hover": { color: "black" }
            }}
            onClick={handleSaveUser}
          >
            Save Profile
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
}

export default ProfileScreen;