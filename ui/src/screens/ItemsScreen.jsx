import React, { useEffect, useState } from "react";
import { 
  Alert, 
  Card, 
  Container, 
  Grid, 
  Snackbar, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from "@mui/material";

import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const ItemsScreen = () => {
  const [ alertMessage, setAlertMessage ] = useState('');
  const [ items, setItems ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ openAlert, setOpenAlert ] = useState(false);
  const [ severity, setSeverity ] = useState('success');

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
        <Card>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
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
                    <TableCell>{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
      {showAlert()}
    </Container>
  );
}

export default ItemsScreen;