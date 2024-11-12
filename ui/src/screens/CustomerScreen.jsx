import React, { useEffect, useState } from "react";
import { 
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/Auth";
import { AddButton, TableHeader } from "../components";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const CustomersScreen = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ customers, setCustomers ] = useState([]);

  const headerLabels = [
    { id: 'number', label: 'Customer No'},
    { id: 'name', label: 'Name' },
    { id: 'mobile', label: 'Mobile Number' },
    { id: 'email', label: 'Email' },
    { id: 'dateCreated', label: 'Date Created' },
    { id: 'status', label: 'Status' }
  ];

  return (
    <Container sx={{ maxWidth: '100vw !important', justifyContent: 'center' }}>
      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="h5" sx={{ mb: 2 }}>Customers</Typography>
          <Box>
            <AddButton title="Add Customer"/>
          </Box>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHeader headerLabel={headerLabels} />
            <TableBody></TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}

export default CustomersScreen;