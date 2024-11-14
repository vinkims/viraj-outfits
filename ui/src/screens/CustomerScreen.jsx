import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
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
import { useNavigate } from "react-router-dom";

import { useAlert } from "../contexts/AlertContext";
import { useAuth } from "../contexts/Auth";
import { AddButton, Iconify, Loading, TableHeader } from "../components";
import FormattingUtils from "../utils/FormattingUtils";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const CustomersScreen = () => {
  const { showAlert } = useAlert();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const initialCustForm = {
    firstName: '',
    lastName: '',
    mobile: '',
    email: ''
  }
  const initialCustFormErrors = {
    firstName: false,
    lastName: false,
    mobile: false,
    email: false
  }
  const [ customerForm, setCustomerForm ] = useState(initialCustForm);
  const [ customerFormErrors, setCustomerFormErrors ] = useState(initialCustFormErrors);
  const [ customerId, setCustomerId ] = useState(null);
  const [ customers, setCustomers ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ newCustomerForm, setNewCustomerForm ] = useState(initialCustForm);
  const [ newCustomerFormErrors, setNewCustomerFormErrors ] = useState(initialCustFormErrors);
  const [ openAddCustomer, setOpenAddCustomer ] = useState(false);
  const [ openEditCustomer, setOpenEditCustomer ] = useState(false);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ pageSize, setPageSize ] = useState(10);
  const [ totalResults, setTotalResults ] = useState(0);

  const headerLabels = [
    { id: 'name', label: 'Name' },
    { id: 'mobile', label: 'Mobile Number' },
    { id: 'email', label: 'Email' },
    { id: 'dateCreated', label: 'Date Created' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
  ];

  useEffect(() => {
    getCustomers();
  }, [pageNumber, pageSize]);

  const clearCustomerFormDetails = () => {
    setCustomerForm(initialCustForm);
    setCustomerFormErrors(initialCustFormErrors);
  }

  const getCustomers = async () => {
    setLoading(true);

    let url = `customer?pgSize=${pageSize}&pgNum=${pageNumber}`;

    await ServerCommunicationUtils.get(url)
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        setCustomers(res.content.data);
        let pageInfo = res.content.pageInfo;
        setPageNumber(pageInfo.pageNumber);
        setPageSize(pageInfo.pageSize);
        setTotalResults(pageInfo.totalResults);
      } else {
        setLoading(false);
        showAlert('Error fetching customers', 'error');
      }
    })
    .catch(error => {
      console.error("Error:", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection'
        : 'Error getting customers';
      showAlert(alertMsg, 'error');
    })
  }

  const getUpdatedFields = () => {
    const updatedFields = {};

    if (newCustomerForm.firstName !== customerForm.firstName) {
      updatedFields.firstName = newCustomerForm.firstName;
    }
    if (newCustomerForm.lastName !== customerForm.lastName) {
      updatedFields.lastName = newCustomerForm.lastName;
    }
    if (newCustomerForm.mobile !== customerForm.mobile) {
      updatedFields.mobile = newCustomerForm.mobile;
    }
    if (newCustomerForm.email !== customerForm.email) {
      updatedFields.email = newCustomerForm.email;
    }

    return updatedFields;
  }

  const handleAddCustomer = () => {
    setOpenAddCustomer(true);
  }

  const handleCloseAddCustomer = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenAddCustomer(false);
    clearCustomerFormDetails();
  }

  const handleCloseEditCustomer = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenEditCustomer(false);
    clearCustomerFormDetails();
  }

  const handleEditCustomer = (custObj) => {
    setOpenEditCustomer(true);
    setCustomerId(custObj.id);

    // set initial values
    setCustomerForm({
      firstName: custObj.firstName,
      lastName: custObj.lastName,
      mobile: custObj.mobileNumber,
      email: custObj.email
    });

    setNewCustomerForm({
      firstName: custObj.firstName,
      lastName: custObj.lastName,
      mobile: custObj.mobileNumber,
      email: custObj.email
    });
  }

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setCustomerForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setCustomerFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));
  }

  const handleNewInputChange = (field) => (event) => {
    const value = event.target.value;
    setNewCustomerForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setNewCustomerFormErrors((prevErrors) => ({
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

  const handleSaveCustomer = async () => {
    if (!validateForm()) {
      return;
    }

    let payload = {};
    payload.firstName = customerForm.firstName;
    payload.lastName = customerForm.lastName;
    payload.mobileNumber = customerForm.mobile;
    payload.email = customerForm.email;

    setLoading(true);

    await ServerCommunicationUtils.post("customer", payload)
    .then(res => {
      if (res.status === 201) {
        setLoading(false);
        showAlert('Customer created successfully', 'success');
        handleCloseAddCustomer();
        getCustomers();
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Customer could not be added. Try again later.'
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
        : 'Error adding customer';
      showAlert(alertMsg, 'error');
    })
  }

  const handleUpdateCustomer = async () => {
    if (!validateNewForm()) {
      return;
    }

    const updatedFields = getUpdatedFields();

    if (Object.keys(updatedFields).length === 0) {
      showAlert('No changes detected', 'info');
      return;
    }

    setLoading(true);

    await ServerCommunicationUtils.patch(`customer/${customerId}`, updatedFields)
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        showAlert('Customer updated successfully', 'success');
        handleCloseEditCustomer();
        getCustomers();
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Customer details could not be updated. Try again later.'
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
        : 'Error updating customer details.';
      showAlert(alertMsg, 'error');
    })
  }

  const logoutUser = () => {
    logout();
    navigate("/login");
  }

  const validateForm = () => {
    const errors = {};

    if (!customerForm.firstName) {
      errors.firstName = true;
    }

    setCustomerFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  const validateNewForm = () => {
    const errors = {};

    if (!newCustomerForm.firstName) {
      errors.firstName = true;
    }

    setNewCustomerFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  return (
    <Container sx={{ maxWidth: '100vw !important', justifyContent: 'center' }}>
      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="h5" sx={{ mb: 2 }}>Customers</Typography>
          <Box>
            <AddButton handleClick={handleAddCustomer} title="Add Customer"/>
          </Box>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHeader headerLabel={headerLabels} />
            <TableBody>
              {customers.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.firstName + ' ' + row.lastName}</TableCell>
                  <TableCell>{row.mobileNumber}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{FormattingUtils.formatDate(row.createdOn)}</TableCell>
                  <TableCell>{row.status.name}</TableCell>
                  <TableCell>
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        sx={{ marginRight: 2, textTransform: "none" }}
                        onClick={() => handleEditCustomer(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        sx={{ textTransform: "none" }}
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
          open={openAddCustomer}
          onClose={handleCloseAddCustomer}
          PaperProps={{ sx: { width: "400px", paddingBottom: "10px" } }}
        >
          <DialogTitle>Add Customer</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" width="100%">
              <TextField
                margin="dense"
                label="First Name"
                name="firstName"
                error={customerFormErrors.firstName}
                helperText={customerFormErrors.firstName && 'Please enter first name'}
                required
                sx={{ flex: 1 }}
                value={customerForm.firstName}
                onChange={handleInputChange('firstName')}
              />
              <TextField
                margin="dense"
                label="Last Name"
                name="lastName"
                sx={{ flex: 1 }}
                value={customerForm.lastName}
                onChange={handleInputChange('lastName')}
              />
              <TextField
                margin="dense"
                label="Mobile Number"
                name="mobile"
                sx={{ flex: 1 }}
                value={customerForm.mobile}
                onChange={handleInputChange('mobile')}
              />
              <TextField
                margin="dense"
                label="Email"
                name="email"
                sx={{ flex: 1 }}
                value={customerForm.email}
                onChange={handleInputChange('email')}
              />
            </Box>
          </DialogContent>
          <Box display="flex" justifyContent="center" marginTop="5px">
            {loading ? (
              <Loading/>
            ) : (
              <>
                <Button onClick={handleCloseAddCustomer} sx={{ bgcolor: '#F13C15', color: "black" }}>Cancel</Button>
                <Button onClick={handleSaveCustomer} sx={{ bgcolor: '#79AA45', color: "black", marginLeft: "20px" }}>Save</Button>
              </>
            )}
          </Box>
        </Dialog>

        <Dialog
          open={openEditCustomer}
          onClose={handleCloseEditCustomer}
          PaperProps={{ sx: { width: "400px", paddingBottom: "10px" } }}
        >
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" width="100%">
              <TextField
                margin="dense"
                label="First Name"
                name="firstName"
                error={newCustomerFormErrors.firstName}
                helperText={newCustomerFormErrors.firstName && 'Please enter first name'}
                required
                sx={{ flex: 1 }}
                value={newCustomerForm.firstName}
                onChange={handleNewInputChange('firstName')}
              />
              <TextField
                margin="dense"
                label="Last Name"
                name="lastName"
                sx={{ flex: 1 }}
                value={newCustomerForm.lastName}
                onChange={handleNewInputChange('lastName')}
              />
              <TextField
                margin="dense"
                label="Mobile Number"
                name="mobile"
                sx={{ flex: 1 }}
                value={newCustomerForm.mobile}
                onChange={handleNewInputChange('mobile')}
              />
              <TextField
                margin="dense"
                label="Email"
                name="email"
                sx={{ flex: 1 }}
                value={newCustomerForm.email}
                onChange={handleNewInputChange('email')}
              />
            </Box>
          </DialogContent>
          <Box display="flex" justifyContent="center" marginTop="5px">
            {loading ? (
              <Loading/>
            ) : (
              <>
                <Button onClick={handleCloseEditCustomer} sx={{ bgcolor: '#F13C15', color: "black" }}>Cancel</Button>
                <Button onClick={handleUpdateCustomer} sx={{ bgcolor: '#79AA45', color: "black", marginLeft: "20px" }}>Save</Button>
              </>
            )}
          </Box>
        </Dialog>

      </Grid>
    </Container>
  );
}

export default CustomersScreen;