import React, { useEffect, useState } from "react";
import { Alert, Card, Container, Grid, Snackbar, TableContainer } from "@mui/material";

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

          </TableContainer>
        </Card>
      </Grid>
    </Container>
  );
}

export default ItemsScreen;