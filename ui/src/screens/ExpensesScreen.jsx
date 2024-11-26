import React, { useEffect, useState } from "react";
import{
  Autocomplete,
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

import { useAlert } from "../contexts/AlertContext";
import { useAuth } from "../contexts/Auth";
import { AddButton, DialogButtons, Iconify, TableHeader } from "../components";
import FormattingUtils from "../utils/FormattingUtils";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const ExpensesScreen = () => {
  const { showAlert } = useAlert();
  const { logout } = useAuth();
  const initialExpenseForm = {
    expenseType: null,
    description: '',
    amount: ''
  };
  const initialExpenseFormErrors = {
    expenseType: false,
    description: false,
    amount: false
  };
  const [ expenseForm, setExpenseForm ] = useState(initialExpenseForm);
  const [ expenseFormErrors, setExpenseFormErrors ] = useState(initialExpenseFormErrors);
  const [ expenses, setExpenses ] = useState([]);
  const [ expenseTypes, setExpenseTypes ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ openAddExpense, setOpenAddExpense ] = useState(false);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ pageSize, setPageSize ] = useState(10);
  const [ totalResults, setTotalResults ] = useState(0);

  const headerLabels = [
    { id: 'expenseType', label: 'Expense Type' },
    { id: 'dateCreated', label: 'Date Created' },
    { id: 'desc', label: 'Description' },
    { id: 'amount', label: 'Amount' },
    { id: 'user', label: 'User' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
  ];

  useEffect(() => {
    getExpenses();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    getExpenseTypes();
  }, []);

  const clearExpenseFormDetails = () => {
    setExpenseForm(initialExpenseForm);
    setExpenseFormErrors(initialExpenseFormErrors);
  }

  const getExpenses = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get("expense")
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        setExpenses(res.content.data);
        let pageInfo = res.content.pageInfo;
        setPageNumber(pageInfo.pageNumber);
        setPageSize(pageInfo.pageSize);
        setTotalResults(pageInfo.totalResults);
      } else if (res.status === 403) {
        logout();
      } else {
        const alertMsg = res.status === 500
          ? 'Error getting expenses'
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
        : 'Error getting expenses.';
      showAlert(alertMsg, 'error');
    })
  }

  const getExpenseTypes = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get("expense/type?pgSize=20")
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        const formattedExpenseTypes = res.content.data
          .map((expenseType) => ({ id: expenseType.id, label: expenseType.name }));
        setExpenseTypes(formattedExpenseTypes);
      } else if (res.status === 403) {
        logout();
      } else {
        const alertMsg = res.status === 500
          ? 'Error getting expense types'
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
        : 'Error getting expense types.';
      showAlert(alertMsg, 'error');
    })
  }

  const handleAddExpense = () => {
    setOpenAddExpense(true);
  }

  const handleCloseAddExpense = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenAddExpense(false);
    clearExpenseFormDetails();
  }

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setExpenseForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setExpenseFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));
  }

  const handleInputSelect = (field) => (_, event) => {
    setExpenseForm((prevForm) => ({
      ...prevForm,
      [field]: event
    }));
    setExpenseFormErrors((prevErrors) => ({
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

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    let payload = {};
    payload.expenseTypeId = expenseForm.expenseType.id;
    payload.description = expenseForm.description;
    payload.amount = expenseForm.amount;

    setLoading(true);

    await ServerCommunicationUtils.post("expense", payload)
    .then(res => {
      if (res.status === 201) {
        setLoading(false);
        showAlert("Expense added successfully", "success");
        handleCloseAddExpense();
        getExpenses();
      } else if (res.status === 403) {
        logout();
      } else {
        const alertMsg = res.status === 500
          ? "Expense could not be added. Try again later."
          : res.detail;
        setLoading(false);
        showAlert(alertMsg, "error");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      setLoading(false);
      let alertMsg = error.toString().includes("NetworkError when attempting to fetch resource")
        ? "Please check your internet connection"
        : "Error adding expense";
      showAlert(alertMsg, "error");
    })
  }

  const validateForm = () => {
    const errors = {};

    if (!expenseForm.expenseType) {
      errors.expenseType = true;
    }
    if (!expenseForm.description) {
      errors.description = true;
    }
    if (!expenseForm.amount) {
      errors.amount = true;
    }

    setExpenseFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  return (
    <Container sx={{ maxWidth: "100vw !important", justifyContent: "center", paddingTop: "50px"}}>
      <Grid container spacing={2} sx={{ marginTop: "10px" }}>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="h5" sx={{ mb: 2 }}>Expenses</Typography>
          <Box>
            <AddButton handleClick={handleAddExpense} title="Add Expense" />
          </Box>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHeader headerLabel={headerLabels} />
            <TableBody>
              {expenses.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontSize: "13px" }}>{row.expenseType.name}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{FormattingUtils.formatDate(row.createdOn)}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.description}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{FormattingUtils.formatAmount(row.amount)}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.user.firstName + ' ' + row.user.lastName}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.status.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="eva:edit-fill" />}
                      sx={{ marginRight: 2, textTransform: "none" }}
                    >
                      Edit
                    </Button>
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
          open={openAddExpense}
          onClose={handleCloseAddExpense}
          PaperProps={{ sx: { width: "400px" } }}
        >
          <DialogTitle>Add Expense</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" width="100%">
              <Autocomplete
                value={expenseForm.expenseType}
                onChange={handleInputSelect('expenseType')}
                options={expenseTypes}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Expense Type"
                    variant="outlined"
                    required
                    error={expenseFormErrors.expenseType}
                    helperText={expenseFormErrors.expenseType && 'Please select expense type'}
                  />
                )}
              />
              <TextField
                margin="dense"
                label="Description"
                name="description"
                sx={{ flex: 1 }}
                required
                error={expenseFormErrors.description}
                helperText={expenseFormErrors.description && 'Please enter description'}
                value={expenseForm.description}
                onChange={handleInputChange('description')}
              />
              <TextField
                margin="dense"
                label="Amount"
                name="amount"
                sx={{ flex: 1 }}
                required
                error={expenseFormErrors.amount}
                helperText={expenseFormErrors.amount && 'Please enter amount'}
                value={expenseForm.amount}
                onChange={handleInputChange('amount')}
              />
            </Box>
          </DialogContent>

          <DialogButtons
            loading={loading}
            cancelTitle="Cancel"
            handleCancel={handleCloseAddExpense}
            submitTitle="Save"
            handleSubmit={handleSaveExpense}
          />
        </Dialog>
      </Grid>
    </Container>
  );
}

export default ExpensesScreen;
