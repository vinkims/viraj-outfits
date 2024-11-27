import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material";

import { useAlert } from "../contexts/AlertContext";
import { useAuth } from "../contexts/Auth";
import { DialogButtons, Iconify } from "../components";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const MenuCategories = [
  { id: "expenseTypes", btnName: "Expense Type", label: "Expense Types", endpoint: "expense/type" },
  { id: "transactionTypes", btnName: "Transaction Type", label: "Transaction Types", endpoint: "transaction/type" },
  { id: "transactionSources", btnName: "Transaction Source", label: "Transaction Sources", endpoint: "transaction/source" },
  { id: "paymentChannels", btnName: "Payment Channel", label: "Payment Channels", endpoint: "payment/channel" },
  { id: "roles", btnName: "Role", label: "Roles", endpoint: "role" },
  { id: "statuses", btnName: "Status", label: "Statuses", endpoint: "status" }
];

const Sidebar = ({ selectedCategory, onCategorySelect }) => (
  <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
    <List>
      {MenuCategories.map((category) => (
        <ListItemButton
          key={category.id}
          selected={selectedCategory === category.id}
          onClick={() => onCategorySelect(category.id)}
        >
          <ListItemText primary={category.label} />
        </ListItemButton>
      ))}
    </List>
  </div>
);

const MainContent = ({ selectedCategory }) => {
  const { logout } = useAuth();
  const { showAlert } = useAlert();
  const initialDataForm = {
    name: '',
    description: ''
  };
  const initialDataFormErrors = {
    name: false,
    description: false
  };
  const [ data, setData ] = useState([]);
  const [ dataForm, setDataForm ] = useState(initialDataForm);
  const [ dataFormErrors, setDataFormErrors ] = useState(initialDataFormErrors);
  const [ loading, setLoading ] = useState(false);
  const [ openAddData, setOpenAddData ] = useState(false);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ pageSize, setPageSize ] = useState(10);
  const [ totalResults, setTotalResults ] = useState(0);

  const category = MenuCategories.find((cat) => cat.id === selectedCategory);

  const headerLabels = [
    { id: 'name', label: 'Name' },
    { id: 'desc', label: 'Description' },
    { id: 'actions', label: 'Actions' }
  ];

  useEffect(() => {
    getData();
  }, [ selectedCategory, pageNumber, pageSize ]);

  const clearAddDataFormDetails = () => {
    setDataForm(initialDataForm);
    setDataFormErrors(initialDataFormErrors);
  }

  const getData = async () => {
    let url = category.endpoint + `?pgSize=${pageSize}&pgNum=${pageNumber}`;
    await ServerCommunicationUtils.get(url)
    .then(res => {
      if (res.status === 200) {
        setData(res.content.data);
        let pageInfo = res.content.pageInfo;
        setPageNumber(pageInfo.pageNumber);
        setPageSize(pageInfo.pageSize);
        setTotalResults(pageInfo.totalResults);
      } else if (res.status === 403) {
        logout();
      } else {
        const alertMsg = res.status === 500
          ? 'Error fetching data'
          : res.detail;
        showAlert(alertMsg, 'error');
      }
    })
    .catch(error => {
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection'
        : 'Error fetching data.';
      showAlert(alertMsg, 'error');
    })
  }

  const handleAddData = () => {
    setOpenAddData(true);
  }

  const handleCloseAddData = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenAddData(false);
    clearAddDataFormDetails();
  }

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setDataForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setDataFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }))
  }

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  }

  const handleRowsPerPageChange = (event) => {
    setPageNumber(0);
    setPageSize(parseInt(event.target.value), 10);
  }

  return (
    <div 
      style={{ 
        padding: "20px", 
        flexGrow: 1, 
        height: "calc(100vh - 100px)",
        overflowY: "auto"
      }}
    >
      <Typography variant="h4">{category?.label}</Typography>
      <div style={{ margin: "20px 0" }}>
        <Button 
          variant="contained" 
          color="inherit"
          sx={{ 
            bgcolor: "#FF6E33", 
            textTransform: "none", 
            color: "white",
            "&:hover": {
              color: "black"
            } 
          }}
          onClick={handleAddData}
        >
          Add New {category?.btnName}
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headerLabels.map((cell) => (
                <TableCell
                  key={cell.id}
                  sx={{ fontWeight: "600", fontSize: "13px" }}
                >
                  {cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "13px" }}>{item.name}</TableCell>
                <TableCell sx={{ fontSize: "13px" }}>{item.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:edit-fill" />}
                    sx={{ textTransform: 'none' }}
                    size="small"
                  >Edit</Button>
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
        rowsPerPageOptions={[10, 20, 50]}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <Dialog
        open={openAddData}
        onClose={handleCloseAddData}
        PaperProps={{ sx: { width: "400px" } }}
      >
        <DialogTitle>Add {category.btnName}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" width="100%">
            <TextField
              margin="dense"
              label="Name"
              name="name"
              sx={{ flex: 1 }}
              required
              error={dataFormErrors.name}
              helperText={dataFormErrors.name && 'Please enter name'}
              value={dataForm.name}
              onChange={handleInputChange('name')}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              sx={{ flex: 1 }}
              required
              error={dataFormErrors.description}
              helperText={dataFormErrors.description && 'Please enter description'}
              value={dataForm.description}
              onChange={handleInputChange('description')}
            />
          </Box>
        </DialogContent>
        <DialogButtons
          loading={loading}
          cancelTitle="Cancel"
          handleCancel={handleCloseAddData}
          submitTitle="Save"
        />
      </Dialog>
    </div>
  );
}

const SettingsScreen = () => {
  const [ selected, setSelected ] = useState("expenseTypes");

  return(
    <Container sx={{ maxWidth: "100vw !important", justifyContent: "center", paddingTop: "50px"}}>
      <Grid container spacing={2} sx={{ marginTop: "10px" }}>
        <Stack direction="row" width="100%">
          <Typography variant="h5">Settings</Typography>
        </Stack>
        <Sidebar selectedCategory={selected} onCategorySelect={setSelected} />
        <MainContent selectedCategory={selected} />
      </Grid>
    </Container>
  );
}

export default SettingsScreen;