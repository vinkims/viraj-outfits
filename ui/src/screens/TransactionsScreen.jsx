import React from "react";
import { 
  Container, 
  Grid,
  Paper,
  Stack,
  Table,
  TableContainer,
  Typography
} from "@mui/material";
import { TableHeader } from "../components";

const TransactionsScreen = () => {
  const headerLabels = [
    { id: 'code', label: 'Transaction Code' },
    { id: 'amount', label: 'Amount' },
    { id: 'date', label: 'Transaction Date' },
    { id: 'type', label: 'Transaction Type' },
    { id: 'status', label: 'Status' }
  ];

  return (
    <Container sx={{ maxWidth: "100vw !important", justifyContent: "center"}}>
      <Grid container spacing={2} sx={{ marginTop: "10px" }}>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="h5" sx={{ mb: 2 }}>Transactions</Typography>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHeader headerLabel={headerLabels}/>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}

export default TransactionsScreen;