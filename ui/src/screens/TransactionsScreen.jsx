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
import { AddButton, Loading, TableHeader } from "../components";
import FormattingUtils from "../utils/FormattingUtils";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const TransactionsScreen = () => {
  const { showAlert } = useAlert();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false);
  const [ openAddTransaction, setOpenAddTransaction ] = useState(false);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ pageSize, setPageSize ] = useState(10);
  const [ paymentChannels, setPaymentChannels ] = useState([]);
  const [ totalResults, setTotalResults ] = useState(0);
  const initialTransactionForm = {
    reference: '',
    amount: '',
    description: '',
    transactionType: null,
    transactionSource: null,
    paymentChannel: null
  };
  const initialTransactionFormErrors = {
    reference: false,
    amount: false,
    description: false,
    transactionType: false,
    transactionSource: false,
    paymentChannel: false
  }
  const [ transactionForm, setTransactionForm ] = useState(initialTransactionForm);
  const [ transactionFormErrors, setTransactionFormErrors ] = useState(initialTransactionFormErrors);
  const [ transactionSources, setTransactionSources ] = useState([]);
  const [ transactionTypes, setTransactionTypes ] = useState([]);
  const [ transactions, setTransactions ] = useState([]);

  const headerLabels = [
    { id: 'code', label: 'Transaction Code' },
    { id: 'amount', label: 'Amount' },
    { id: 'date', label: 'Transaction Date' },
    { id: 'desc', label: 'Description' },
    { id: 'type', label: 'Transaction Type' },
    { id: 'source', label: 'Transaction Source' },
    { id: 'channel', label: 'Payment Channel' },
    { id: 'ref', label: 'Reference' },
    { id: 'user', label: 'User' },
    { id: 'status', label: 'Status' }
  ];

  const includedTransactionIds = [12, 14, 15, 16, 17, 18, 19, 20];

  useEffect(() => {
    getTransactions();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    getPaymentChannels();
  }, []);

  useEffect(() => {
    getTransactionSources();
  }, []);

  useEffect(() => {
    getTransactionTypes();
  }, []);

  const clearTransactionFormDetails = () => {
    setTransactionForm(initialTransactionForm);
    setTransactionFormErrors(initialTransactionFormErrors);
  }

  const getPaymentChannels = async () => {
    
    await ServerCommunicationUtils.get("payment/channel")
    .then(res => {
      if (res.status === 200) {
        const channels = res.content.data.map((channel) => ({ id: channel.id, label: channel.name}));
        setPaymentChannels(channels);
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Error getting payment channels.'
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
        : 'Error getting payment channels.';
      showAlert(alertMsg, 'error');
    })
  }

  const getTransactionSources = async () => {
    
    await ServerCommunicationUtils.get("transaction/source")
    .then(res => {
      if (res.status === 200) {
        const sources = res.content.data.map((src) => ({ id: src.id, label: src.name}));
        setTransactionSources(sources);
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Error getting transaction sources.'
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
        : 'Error getting transaction sources.';
      showAlert(alertMsg, 'error');
    })
  }

  const getTransactionTypes = async () => {
    
    await ServerCommunicationUtils.get("transaction/type?pgSize=30")
    .then(res => {
      if (res.status === 200) {
        const types = res.content.data
          .filter((type) => includedTransactionIds.includes(type.id))
          .map((type) => ({ id: type.id, label: type.name}));
        setTransactionTypes(types);
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Error getting transaction types.'
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
        : 'Error getting transaction types.';
      showAlert(alertMsg, 'error');
    })
  }

  const getTransactions = async () => {
    setLoading(true);

    let url = `transaction?pgSize=${pageSize}&pgNum=${pageNumber}`;

    await ServerCommunicationUtils.get(url)
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        setTransactions(res.content.data);
        let pageInfo = res.content.pageInfo;
        setPageNumber(pageInfo.pageNumber);
        setPageSize(pageInfo.pageSize);
        setTotalResults(pageInfo.totalResults);
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Error getting transactions.'
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
        : 'Error getting transactions';
      showAlert(alertMsg, 'error');
    })
  }

  const handleAddTransaction = () => {
    setOpenAddTransaction(true);
  }

  const handleCloseAddTransaction = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenAddTransaction(false);
    clearTransactionFormDetails();
  }

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setTransactionForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setTransactionFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));
  }

  const handleInputSelect = (field) => (_, event) => {
    setTransactionForm((prevForm) => ({
      ...prevForm,
      [field]: event
    }));
    setTransactionFormErrors((prevErrors) => ({
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

  const handleSaveTransaction = async () => {
    if (!validateForm()) {
      return;
    }

    let payload = {};
    payload.reference = transactionForm.reference;
    payload.amount = transactionForm.amount;
    payload.description = transactionForm.description;
    payload.transactionTypeId = transactionForm.transactionType?.id;
    payload.transactionSourceId = transactionForm.transactionSource?.id;
    payload.paymentChannelId = transactionForm.paymentChannel?.id;

    console.log("Payload: ", payload);
    setLoading(true);

    await ServerCommunicationUtils.post("transaction", payload)
    .then(res => {
      if (res.status === 201) {
        setLoading(false);
        showAlert('Transaction added successfully', 'success');
        handleCloseAddTransaction();
        getTransactions();
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Transaction could not be added. Try again later.'
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
        : 'Error adding transaction';
      showAlert(alertMsg, 'error');
    })
  }

  const logoutUser = () => {
    logout();
    navigate("/login");
  }

  const validateForm = () => {
    const errors = {};

    if (!transactionForm.amount) {
      errors.amount = true;
    }
    if (!transactionForm.transactionType) {
      errors.transactionType = true;
    }

    setTransactionFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  return (
    <Container sx={{ maxWidth: "100vw !important", justifyContent: "center"}}>
      <Grid container spacing={2} sx={{ marginTop: "10px" }}>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="h5" sx={{ mb: 2 }}>Transactions</Typography>
          <Box>
            <AddButton handleClick={handleAddTransaction} title="Add Transaction" />
          </Box>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHeader headerLabel={headerLabels}/>
            <TableBody>
              {transactions.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.transactionCode}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{FormattingUtils.formatDate(row.createdOn)}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.transactionType.name}</TableCell>
                  <TableCell>{row.transactionSource?.name}</TableCell>
                  <TableCell>{row.paymentChannel.name}</TableCell>
                  <TableCell>{row.reference}</TableCell>
                  <TableCell>{row.user.firstName + ' ' + row.user.lastName}</TableCell>
                  <TableCell>{row.status.name}</TableCell>
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
          open={openAddTransaction}
          onClose={handleCloseAddTransaction}
          PaperProps={{ sx: { width: "500px" } }}
        >
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="space-between" width="100%">
              <TextField
                margin="dense"
                label="Reference"
                name="reference"
                sx={{ flex: 1 }}
                error={transactionFormErrors.reference}
                helperText={transactionFormErrors.reference && 'Please enter reference'}
                value={transactionForm.reference}
                onChange={handleInputChange('reference')}
              />
              <TextField
                margin="dense"
                label="Amount"
                name="amount"
                required
                sx={{ flex: 1, marginLeft: "10px" }}
                error={transactionFormErrors.amount}
                helperText={transactionFormErrors.amount && 'Please enter amount'}
                value={transactionForm.amount}
                onChange={handleInputChange('amount')}
              />
            </Box>
            <Box display="flex" width="100%">
              <TextField
                margin="dense"
                label="Description"
                name="description"
                sx={{ flex: 1 }}
                error={transactionFormErrors.description}
                helperText={transactionFormErrors.description && 'Please enter description'}
                value={transactionForm.description}
                onChange={handleInputChange('description')}
              />
            </Box>
            <Box display="flex" width="100%">
              <Autocomplete
                value={transactionForm.transactionType}
                onChange={handleInputSelect('transactionType')}
                options={transactionTypes}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Transaction Type"
                    variant="outlined"
                    required
                    error={transactionFormErrors.transactionType}
                    helperText={transactionFormErrors.transactionType && 'Please select transaction type'}
                  />
                )}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Autocomplete
                value={transactionForm.transactionSource}
                onChange={handleInputSelect('transactionSource')}
                options={transactionSources}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Transaction Source"
                    variant="outlined"
                    error={transactionFormErrors.transactionSource}
                    helperText={transactionFormErrors.transactionSource && 'Please select transaction source'}
                  />
                )}
              />
              <Autocomplete
                value={transactionForm.paymentChannel}
                onChange={handleInputSelect('paymentChannel')}
                options={paymentChannels}
                sx={{ flex: 1, marginLeft: "10px" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Payment Channel"
                    variant="outlined"
                    error={transactionFormErrors.paymentChannel}
                    helperText={transactionFormErrors.paymentChannel && 'Please select payment channel'}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <Box display="flex" justifyContent="center" marginTop="5px" marginBottom="10px">
            {loading ? (
              <Loading/>
            ) : (
              <>
                <Button onClick={handleCloseAddTransaction} sx={{ bgcolor: '#F13C15', color: "black" }}>Cancel</Button>
                <Button onClick={handleSaveTransaction} sx={{ bgcolor: '#79AA45', color: "black", marginLeft: "20px" }}>Save</Button>
              </>
            )}
          </Box>
        </Dialog>

      </Grid>
    </Container>
  );
}

export default TransactionsScreen;