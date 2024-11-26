import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

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
  const [ data, setData ] = useState([]);

  const category = MenuCategories.find((cat) => cat.id === selectedCategory);

  return (
    <div style={{ padding: "20px", flexGrow: 1 }}>
      <Typography variant="h4">{category?.label}</Typography>
      <div style={{ margin: "20px 0" }}>
        <Button variant="contained" sx={{ bgcolor: "#FF6E33", textTransform: "none" }}>Add New {category?.btnName}</Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Button>Edit</Button>
                <Button>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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