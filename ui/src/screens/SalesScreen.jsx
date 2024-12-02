import React, { useState, useEffect } from "react";
import { 
  Container, 
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";

import { useAlert } from "../contexts/AlertContext";
import { useAuth } from "../contexts/Auth";
import { Loading, TableHeader } from "../components";
import FormattingUtils from "../utils/FormattingUtils";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";

const SalesScreen = () => {
  const { showAlert } = useAlert();
  const { logout } = useAuth();
  const [ loading, setLoading ] = useState(false);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ pageSize, setPageSize ] = useState(10);
  const [ sales, setSales ] = useState([]);
  const [ totalResults, setTotalResults ] = useState(0);

  const headerLabels = [
    { id: 'saleNo', label: 'Sales Number' },
    { id: 'item', label: 'Item' },
    { id: 'saleType', label: 'Sale Type' },
    { id: 'date', label: 'Date Sold' },
    { id: 'channel', label: 'Payment Channel' },
    { id: 'amount', label: 'Sale Amount' },
    { id: 'profit', label: 'Profit' },
    { id: 'status', label: 'Status' }
  ];

  useEffect(() => {
    getSales();
  }, [pageNumber, pageSize]);

  const getSales = async () => {
    setLoading(true);

    let url = `sale?pgSize=${pageSize}&pgNum=${pageNumber}`;

    await ServerCommunicationUtils.get(url)
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        setSales(res.content.data);
        let pageInfo = res.content.pageInfo;
        setPageNumber(pageInfo.pageNumber);
        setPageSize(pageInfo.pageSize);
        setTotalResults(pageInfo.totalResults);
      } else if (res.status === 403) {
        logout();
      } else {
        const alertMsg = res.status === 500
          ? 'Error getting sales.'
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
        : 'Error getting sales.';
      showAlert(alertMsg, 'error');
    })
  }

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  }

  const handleRowsPerPageChange = (event) => {
    setPageNumber(0);
    setPageSize(parseInt(event.target.value), 10);
  }

  if (loading) {
    return (<Loading/>);
  }

  return (
    <Container sx={{ maxWidth: '100vw !important', justifyContent: 'center', paddingTop: "50px" }}>
      <Grid container spacing={2} sx={{ marginTop: "10px"}}>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="h5" sx={{ mb: 2 }}>Sales</Typography>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHeader headerLabel={headerLabels} />
            <TableBody>
              {sales.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontSize: "13px" }}>{row.salesNumber}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.item?.itemType?.name + ' ' + row.item?.name}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.saleType?.name}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{FormattingUtils.formatDate(row.createdOn)}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.paymentChannel?.name}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{FormattingUtils.formatAmount(row.netAmount)}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{FormattingUtils.formatAmount(row.netAmount - row.item?.price)}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.status.name}</TableCell>
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
      </Grid>
    </Container>
  );
}

export default SalesScreen;