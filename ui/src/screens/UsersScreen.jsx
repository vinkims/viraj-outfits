import React, { useEffect, useState } from "react";
import { 
  Autocomplete,
  Box,
  Button,
  Container, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityOnIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

import { useAlert } from "../contexts/AlertContext";
import { useAuth } from "../contexts/Auth";
import { AddButton, DialogButtons, Iconify, TableHeader } from "../components";
import FormattingUtils from "../utils/FormattingUtils";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const UsersScreen = () => {
  const { showAlert } = useAlert();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const intitialUserForm = {
    firstName: '',
    lastName: '',
    email: '',
    role: null,
    password: '',
    confirmPassword: ''
  };
  const intitialUserFormErrors = {
    firstName: false,
    lastName: false,
    email: false,
    role: false,
    password: false,
    confirmPassword: false
  };
  const [ confirmPasswordTouched, setConfirmPasswordTouched ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ openAddUser, setOpenAddUser ] = useState(false);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ pageSize, setPageSize ] = useState(10);
  const [ passwordErrors, setPasswordErrors ] = useState([]);
  const [ roles, setRoles ] = useState([]);
  const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const [ totalResults, setTotalResults ] = useState(0);
  const [ userForm, setUserForm ] = useState(intitialUserForm);
  const [ userFormErrors, setUserFormErrors ] = useState(intitialUserFormErrors);
  const [ users, setUsers ] = useState([]);

  const headerLabels = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'dateCreated', label: 'Date Created' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
  ];

  const passwordRequirements = [
    { test: (pwd) => pwd.length >= 8, message: "At least 8 characters" },
    { test: (pwd) => /[A-Z]/.test(pwd), message: "At least one uppercase letter" },
    { test: (pwd) => /[a-z]/.test(pwd), message: "At least one lowercase letter" },
    { test: (pwd) => /\d/.test(pwd), message: "At least one number" },
    { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), message: "At least one special character" }
  ];

  useEffect(() => {
    getUsers();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    getRoles();
  }, []);

  const excludedRoleIds = [1, 4];

  const clearAddUserFormDetails = () => {
    setUserForm(intitialUserForm);
    setUserFormErrors(intitialUserFormErrors);
    setConfirmPasswordTouched(false);
  }

  const getRoles = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get("role")
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        const includedRoles = res.content.data
          .filter((role) => !excludedRoleIds.includes(role.id))
          .map((role) => ({ id: role.id, label: role.name }));
        setRoles(includedRoles);
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Error getting roles.'
          : res.detail;
        setLoading(false);
        showAlert(alertMsg, 'error');
      }
    })
    .catch(error => {
      console.error("Error", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection'
        : 'Error getting roles.';
      showAlert(alertMsg, 'error');
    })
  }

  const getUsers = async () => {
    setLoading(true);

    let url = `user?pgSize=${pageSize}&pgNum=${pageNumber}`;

    await ServerCommunicationUtils.get(url)
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        setUsers(res.content.data);
        let pageInfo = res.content.pageInfo;
        setPageNumber(pageInfo.pageNumber);
        setPageSize(pageInfo.pageSize);
        setTotalResults(pageInfo.totalResults);
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Error getting users.'
          : res.detail;
        setLoading(false);
        showAlert(alertMsg, 'error');
      }
    })
    .catch(error => {
      console.error("Error", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection'
        : 'Error getting users.';
      showAlert(alertMsg, 'error');
    })
  }

  const handleAddUser = () => {
    setOpenAddUser(true);
  }

  const handleCloseAddUser = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenAddUser(false);
    clearAddUserFormDetails();
  }

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setUserForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setUserFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));

    if (field === "confirmPassword") {
      setConfirmPasswordTouched(true);
    }

    // password validation logic
    if (field === "password" || field === "confirmPassword") {
      const { password, confirmPassword} = {
        ...userForm,
        [field]: value
      };

      const newErrors = passwordRequirements
        .filter((req) => !req.test(password))
        .map((req) => req.message);

      if (password !== confirmPassword) {
        newErrors.push("Passwords do not match");
      }

      setPasswordErrors(newErrors);
    }
  }

  const handleInputSelect = (field) => (_, event) => {
    setUserForm((prevForm) => ({
      ...prevForm,
      [field]: event
    }));
    setUserFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));
  }

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  }

  const handleRowsPerPageChange = (event) => {
    setPageNumber(0);
    setPageSize(parseInt(event.target.value), 10);
  }

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    let payload = {};
    payload.firstName = userForm.firstName;
    payload.lastName = userForm.lastName;
    payload.contacts = [
      {
        contactTypeId: 2,
        value: userForm.email
      }
    ];
    payload.roleId = userForm.role?.id;
    payload.password = userForm.password;

    setLoading(true);

    await ServerCommunicationUtils.post("user", payload)
    .then(res => {
      if (res.status === 201) {
        setLoading(false);
        showAlert("User added successfully", 'success');
        handleCloseAddUser();
        getUsers();
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'User could not be added. Try again later.'
          : res.detail;
        setLoading(false);
        showAlert(alertMsg, 'error');
      }
    })
    .catch(error => {
      console.error("Error:", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection'
        : 'Error adding user';
      showAlert(alertMsg, 'error');
    })
  }

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }

  const isRequirementMet = (test) => test(userForm.password);

  const logoutUser = () => {
    logout();
    navigate("/login");
  }

  const validateForm = () => {
    const errors = {};

    if (!userForm.firstName) {
      errors.firstName = true;
    }
    if (!userForm.lastName) {
      errors.lastName = true;
    }
    if (!userForm.role) {
      errors.role = true;
    }
    if (!userForm.email) {
      errors.email = true;
    }
    if (!userForm.password) {
      errors.password = true;
    }
    if (!userForm.confirmPassword) {
      errors.confirmPassword = true;
    }

    setUserFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  return(
    <Container sx={{ maxWidth: '100vw !important', justifyContent: 'center', paddingTop: "50px" }}>
      <Grid container spacing={2} sx={{ marginTop: "10px" }}>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="h5" sx={{ mb: 2 }}>Users</Typography>
          <Box>
            <AddButton handleClick={handleAddUser} title="Add User" />
          </Box>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHeader headerLabel={headerLabels}/>
            <TableBody>
              {users.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontSize: "13px" }}>{row.firstName + ' ' + row.lastName}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.contacts?.[0].value}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{FormattingUtils.formatDate(row.createdOn)}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.role.name}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.status.name}</TableCell>
                  <TableCell>
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        sx={{ marginRight: 2, textTransform: "none" }}
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        sx={{ textTransform: "none" }}
                        size="small"
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={pageNumber}
          component="div"
          count={totalResults}
          rowsPerPage={pageSize}
          onPageChange={handlePageChange}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <Dialog
          open={openAddUser}
          onClose={handleCloseAddUser}
          PaperProps={{ sx: { width: "600px" } }}
        >
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="space-between" width="100%">
              <TextField
                margin="dense"
                label="First Name"
                name="firstname"
                sx={{ flex: 1 }}
                required
                error={userFormErrors.firstName}
                helperText={userFormErrors.firstName && 'Please enter first name'}
                value={userForm.firstName}
                onChange={handleInputChange('firstName')}
              />
              <TextField
                margin="dense"
                label="Last Name"
                name="lastName"
                sx={{ flex: 1, marginLeft: "10px" }}
                required
                error={userFormErrors.lastName}
                helperText={userFormErrors.lastName && 'Please enter last name'}
                value={userForm.lastName}
                onChange={handleInputChange('lastName')}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <TextField
                margin="dense"
                label="Email"
                name="email"
                sx={{ flex: 2 }}
                required
                error={userFormErrors.email}
                helperText={userFormErrors.email && 'Please enter a valid email'}
                value={userForm.email}
                onChange={handleInputChange('email')}
              />
              <Autocomplete
                value={userForm.role}
                onChange={handleInputSelect('role')}
                options={roles}
                sx={{ flex: 1, marginLeft: "10px" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Role"
                    variant="outlined"
                    required
                    error={userFormErrors.role}
                    helperText={userFormErrors.role && 'Please select role'}
                  />
                )}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
              <Box display="flex" flexDirection="column" width="40%">
                <TextField
                  margin="dense"
                  name="password"
                  label="Password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  error={userFormErrors.password}
                  helperText={userFormErrors.password && 'Please enter password.'}
                  value={userForm.password}
                  onChange={handleInputChange('password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          {showPassword ? <VisibilityOffIcon/> : <VisibilityOnIcon/>}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  margin="dense"
                  name="confirmpassword"
                  label="Confirm Password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  error={userFormErrors.confirmPassword}
                  helperText={userFormErrors.confirmPassword && 'Please confirm password.'}
                  value={userForm.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleToggleConfirmPasswordVisibility}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon/> : <VisibilityOnIcon/>}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box width="60%" marginTop="15px">
                {passwordRequirements.map((req, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "20px",
                      gap: 1,
                      color: isRequirementMet(req.test) ? "green" : "red"
                    }}
                  >
                    {isRequirementMet(req.test) ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <CancelIcon fontSize="small" />
                    )}
                    <Typography variant="body2">{req.message}</Typography>
                  </Box>
                ))}
                {passwordErrors.includes("Passwords do not match") && confirmPasswordTouched && (
                  <Typography sx={{ marginLeft: "20px", marginTop: "5px" }} color="red" variant="body2">Passwords do not match</Typography>
                )}
              </Box>
            </Box>
          </DialogContent>

          <DialogButtons
            loading={loading}
            cancelTitle="Cancel"
            handleCancel={handleCloseAddUser}
            submitTitle="Save"
            handleSubmit={handleSaveUser}
          />
        </Dialog>

      </Grid>
    </Container>
  );
}

export default UsersScreen;