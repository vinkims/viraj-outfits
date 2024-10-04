import React, { useEffect, useState } from "react";
import { 
  Alert, 
  Container, 
  Grid, 
  Paper, 
  Snackbar, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow 
} from "@mui/material";
import moment from "moment";

import { TableHeader } from "../components";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const ItemsScreen = () => {
  const [ alertMessage, setAlertMessage ] = useState('');
  const [ items, setItems ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ openAlert, setOpenAlert ] = useState(false);
  const [ severity, setSeverity ] = useState('success');

  const headerLabels = [
    { id: 'itemType', label: 'Item Type'},
    { id: 'name', label: 'Name'},
    { id: 'category', label: 'Category'},
    { id: 'color', label: 'Color'},
    { id: 'size', label: 'Size'},
    { id: 'date', label: 'Date Added'},
    { id: 'price', label: 'Price'},
    { id: 'status', label: 'Status'}
  ];

  useEffect(() => {
    getItems();
  }, [])

  const getItems = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get('item')
    .then(data => {
      console.log("Data: ", data);
      if (data.status === 200) {
        setLoading(false);
        setItems(data.content.data);
      } else {
        setLoading(false);
        setOpenAlert(true);
        setSeverity('error');
        setAlertMessage('Error fetching items');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      setOpenAlert(true);
      setSeverity('error');
      if (error.toString().includes('NetworkError when attempting to fetch resource')) {
        setAlertMessage('Please check your internet connection');
      } else {
        setAlertMessage('Error fetching items');
      }
    })
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
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
    <Container sx={{ maxWidth: '100vw !important', justifyContent: 'center' }}>
      <Grid container spacing={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHeader
              headerLabel={headerLabels}
            />
            <TableBody>
              {items.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.itemType.name}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.category.name}</TableCell>
                  <TableCell>{row.color}</TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>{moment().format('Do MMMM YYYY', row.createdOn)}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.status.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {showAlert()}
    </Container>
  );
}

export default ItemsScreen;