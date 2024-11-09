import React, { useEffect, useState } from "react";
import { 
  Alert, 
  Autocomplete, 
  Box, 
  Button, 
  CircularProgress, 
  Container, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Grid, 
  Paper, 
  Snackbar, 
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

import { useAuth } from "../contexts/Auth";
import { AddButton, Iconify, TableHeader } from "../components";
import FormattingUtils from "../utils/FormattingUtils";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";
import ValidationUtils from "../utils/ValidationUtils";

const ItemsScreen = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ alertMessage, setAlertMessage ] = useState('');
  const [ categories, setCategories ] = useState('');
  const [ categoryErrorText, setCategoryErrorText ] = useState('');
  const [ color, setColor ] = useState('');
  const [ colorErrorText, setColorErrorText ] = useState('');
  const [ isCategoryError, setIsCategoryError ] = useState(false);
  const [ isColorError, setIsColorError ] = useState(false);
  const [ isItemCodeError, setIsItemCodeError ] = useState(false);
  const [ isItemTypeError, setIsItemTypeError ] = useState(false);
  const [ isItemTypeNameError, setIsItemTypeNameError ] = useState(false);
  const [ isNameError, setIsNameError ] = useState(false);
  const [ isPriceError, setIsPriceError ] = useState(false);
  const [ isSizeError, setIsSizeError ] = useState(false);
  const [ itemCode, setItemCode ] = useState('');
  const [ itemCodeErrorText, setItemCodeErrorText ] = useState('');
  const [ items, setItems ] = useState([]);
  const [ itemTypeErrorText, setItemTypeErrorText ] = useState('');
  const [ itemTypeName, setItemTypeName ] = useState('');
  const [ itemTypeNameErrorText, setItemTypeNameErrorText ] = useState('');
  const [ itemTypes, setItemTypes ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ name, setName ] = useState('');
  const [ nameErrorText, setNameErrorText ] = useState('');
  const [ openAddItem, setOpenAddItem ] = useState(false);
  const [ openAddItemType, setOpenAddItemType ] = useState(false);
  const [ openAlert, setOpenAlert ] = useState(false);
  const [ page, setPage ] = useState(0);
  const [ price, setPrice ] = useState('');
  const [ priceErrorText, setPriceErrorText ] = useState('');
  const [ selectedCategory, setSelectedCategory ] = useState(null);
  const [ selectedItemType, setSelectedItemType ] = useState(null);
  const [ severity, setSeverity ] = useState('success');
  const [ size, setSize ] = useState('');
  const [ sizeErrorText, setSizeErrorText ] = useState('');

  const headerLabels = [
    { id: 'itemCode', label: 'Item Code'},
    { id: 'itemType', label: 'Item Type'},
    { id: 'name', label: 'Name'},
    { id: 'category', label: 'Category'},
    { id: 'color', label: 'Color'},
    { id: 'size', label: 'Size'},
    { id: 'date', label: 'Date Added'},
    { id: 'price', label: 'Buying Price'},
    { id: 'status', label: 'Status'},
    { id: 'actions', label: 'Actions' }
  ];

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    getItemTypes();
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  const clearAddItemDetails = () => {
    setSelectedItemType(null);
    setIsItemTypeError(false);
    setName('');
    setIsNameError(false);
    setSelectedCategory(null);
    setIsCategoryError(false);
    setItemCode('');
    setIsItemCodeError(false);
    setColor('');
    setIsColorError(false);
    setSize('');
    setIsSizeError(false);
    setPrice('');
    setIsPriceError(false);
  }

  const clearAddItemTypeDetails = () => {
    setItemTypeName('');
    setIsItemTypeNameError(false);
  }

  const getCategories = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get('category')
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        const formattedCategories = res.content.data.map((type) => ({ id: type.id, label: type.name}));
        setCategories(formattedCategories);
      } else {
        setLoading(false);
        setOpenAlert(true);
        setSeverity('error');
        setAlertMessage('Error fetching categories');
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
        setAlertMessage('Error fetching categories');
      }
    })
  }

  const getItems = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get('item')
    .then(data => {
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

  const getItemTypes = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get("item/type")
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        const formattedItemTypes = res.content.data.map((type) => ({ id: type.id, label: type.name}));
        setItemTypes(formattedItemTypes);
      } else {
        setLoading(false);
        setOpenAlert(true);
        setSeverity('error');
        setAlertMessage('Error fetching product items');
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
        setAlertMessage('Error fetching item types');
      }
    })
  }

  const handleAddItem = () => {
    setOpenAddItem(true);
  }

  const handleAddItemType = () => {
    setOpenAddItemType(true);
  }

  const handleCategorySelect = (_, value) => {
    setSelectedCategory(value);
  }

  const handleCloseAddItem = (event, reason) => {
    if(reason === 'backdropClick') {
      return;
    }
    setOpenAddItem(false);
    clearAddItemDetails();
  }

  const handleCloseAddItemType = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenAddItemType(false);
    setItemTypeName('');
    setIsItemTypeNameError(false);
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  }

  const handleColorChange = (event) => {
    const colorValue = event.target.value;
    setColor(colorValue);
    setIsColorError(false);
  }

  const handleItemCodeChange = (event) => {
    const codeValue = event.target.value;
    setItemCode(codeValue);
    setIsItemCodeError(false);
  }

  const handleItemTypeNameChange = (event) => {
    const typeName = event.target.value;
    setItemTypeName(typeName);
    setIsItemTypeNameError(false);
  }

  const handleItemTypeSelect = (_, value) => {
    setSelectedItemType(value);
  }

  const handleNameChange = (event) => {
    const nameValue = event.target.value;
    setName(nameValue);
    setIsNameError(false);
  }

  const handlePriceChange = (event) => {
    const priceValue = event.target.value;
    setPrice(priceValue);
    setIsPriceError(false);
  }

  const handleSaveItem = async () => {
    const conditions = [
      {
        value: selectedItemType,
        setError: setIsItemTypeError,
        setErrorText: setItemTypeErrorText,
        errorMessage: 'Please select item type'
      },
      {
        value: name,
        setError: setIsNameError,
        setErrorText: setNameErrorText,
        errorMessage: 'Please enter name'
      },
      {
        value: selectedCategory,
        setError: setIsCategoryError,
        setErrorText: setCategoryErrorText,
        errorMessage: 'Please select category'
      },
      {
        value: color,
        setError: setIsColorError,
        setErrorText: setColorErrorText,
        errorMessage: 'Please enter color'
      },
      {
        value: price,
        setError: setIsPriceError,
        setErrorText: setPriceErrorText,
        errorMessage: 'Please enter price'
      }
    ];

    const errorMessages = ValidationUtils.validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    let payload = {};
    payload.name = name;
    payload.itemTypeId = selectedItemType.id;
    payload.categoryId = selectedCategory.id;
    payload.itemCode = itemCode;
    payload.color = color;
    payload.size = size;
    payload.price = price;

    setLoading(true);

    await ServerCommunicationUtils.post("item", payload)
    .then(res => {
      if (res.status === 201) {
        setLoading(false);
        setOpenAlert(true);
        setSeverity('success');
        setAlertMessage('Item added successfully');
        setOpenAddItem(false);
        clearAddItemDetails();
        getItems();
      } else if (res.status === 403){
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Item could not bre added. Try again later.'
          : res.detail;
        setLoading(false);
        setOpenAlert(true);
        setSeverity('error');
        setAlertMessage(alertMsg);
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
        setAlertMessage('Error adding item');
      }
    })
  }

  const handleSaveItemType = async () => {
    const conditions = [
      {
        value: itemTypeName,
        setError: setIsItemTypeNameError,
        setErrorText: setItemTypeNameErrorText,
        errorMessage: 'Please enter item type name'
      }
    ];

    const errorMessages = ValidationUtils.validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    let payload = {
      name: itemTypeName
    }

    setLoading(true);

    await ServerCommunicationUtils.post("item/type", payload)
    .then(res => {
      if (res.status === 201) {
        setLoading(false);
        setOpenAlert(true);
        setSeverity('success');
        setAlertMessage('Item type created successfully');
        setOpenAddItemType(false);
        clearAddItemTypeDetails();
        getItemTypes();
      } else if (res.status === 403) {
        logoutUser();
      } else {
        console.log("Error res: ", res);
        const alertMsg = res.status === 500
          ? 'Item type could not be added. Please try again.'
          : res.detail;
        setLoading(false);
        setOpenAlert(true);
        setSeverity('error');
        setAlertMessage(alertMsg);
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
        setAlertMessage('Error adding item type');
      }
    })
  }

  const handleSizeChange = (event) => {
    const sizeValue = event.target.value;
    setSize(sizeValue);
    setIsSizeError(false);
  }

  const logoutUser = () => {
    logout();
    navigate("/login");
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
      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Typography variant="h5" sx={{ mb: 2 }}>
            Items
          </Typography>
          <Box>
            <AddButton title="Add Item" handleClick={handleAddItem} />
          </Box>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHeader
              headerLabel={headerLabels}
            />
            <TableBody>
              {items.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.itemCode}</TableCell>
                  <TableCell>{row.itemType.name}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.category.name}</TableCell>
                  <TableCell>{row.color}</TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>{FormattingUtils.formatDate(row.createdOn)}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.status.name}</TableCell>
                  <TableCell>
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        sx={{ marginRight: 2, textTransform: 'none' }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<Iconify icon="eva:shopping-cart-fill" />}
                        sx={{ textTransform: 'none' }}
                      >
                        Sell
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* <TablePagination
          page={page}
        /> */}

        <Dialog
          open={openAddItem}
          onClose={handleCloseAddItem}
          PaperProps={{ sx: { width: "500px" } }}
        >
          <DialogTitle>Add Item</DialogTitle>
          <Typography variant="caption" ml={3}>* If you can't find an item type on the list click the <strong>Add Item Type</strong> link below</Typography>
          <DialogContent
            sx={{
              filter: openAddItemType ? 'blur(2px)' : 'none',
              pointerEvents: openAddItemType ? 'none' : 'auto'
            }}
          >
            <Box display="flex" justifyContent="space-between" width="100%">
              <Autocomplete
                value={selectedItemType}
                onChange={handleItemTypeSelect}
                options={itemTypes}
                sx={{ flex:1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item Type"
                    variant="outlined"
                    required
                    margin="dense"
                    error={isItemTypeError}
                    helperText={isItemTypeError ? itemTypeErrorText : ''}
                  />
                )}
              />
              <TextField
                margin="dense"
                label="Name"
                name="name"
                error={isNameError}
                helperText={isNameError ? nameErrorText : ''}
                required
                sx={{ marginLeft: "10px", flex: 1 }}
                value={name}
                onChange={handleNameChange}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
              <Autocomplete
                value={selectedCategory}
                onChange={handleCategorySelect}
                options={categories}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Category"
                    variant="outlined"
                    required
                    error={isCategoryError}
                    helperText={isCategoryError ? categoryErrorText : ''}
                  />
                )}
              />
              <TextField
                margin="dense"
                label="Item Code"
                name="itemCode"
                error={isItemCodeError}
                helperText={isItemCodeError ? itemCodeErrorText : ''}
                sx={{ marginLeft: "10px", flex: 1 }}
                value={itemCode}
                onChange={handleItemCodeChange}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
              <TextField
                margin="dense"
                label="Color"
                name="color"
                error={isColorError}
                helperText={isColorError ? colorErrorText : ''}
                value={color}
                required
                onChange={handleColorChange}
                sx={{ flex: 1 }}
              />
              <TextField
                margin="dense"
                label="Size"
                name="size"
                error={isSizeError}
                helperText={isSizeError ? sizeErrorText : ''}
                value={size}
                onChange={handleSizeChange}
                sx={{ flex: 1, marginLeft: "10px" }}
              />
              <TextField
                margin="dense"
                label="Price"
                name="price"
                error={isPriceError}
                helperText={isPriceError ? priceErrorText : ''}
                value={price}
                required
                onChange={handlePriceChange}
                sx={{ flex: 1, marginLeft: "10px" }}
              />
            </Box>
          </DialogContent>
          <Box display="flex" justifyContent="center" marginTop="5px" marginBottom="10px">
          <Button
            variant="text"
            sx={{ alignSelf: "flex-start", mr: 5, textTransform: "none" }}
            onClick={handleAddItemType}
          >
            Add Item Type
          </Button>
            {loading ? (
              <CircularProgress color="success" size={20} />
            ) : (
              !openAddItemType &&
                <DialogActions>
                  <Button color="inherit" sx={{ bgcolor: '#F13C15' }} onClick={handleCloseAddItem}>Cancel</Button>
                  <Button color="inherit" sx={{ bgcolor: '#79AA45', marginLeft: "20px" }} onClick={handleSaveItem}>Save</Button>
                </DialogActions>
            )}
          </Box>
          {openAddItemType && (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <TextField
                margin="dense"
                label="Item Type Name"
                error={isItemTypeNameError}
                helperText={isItemTypeNameError ? itemTypeNameErrorText : ''}
                required
                value={itemTypeName}
                onChange={handleItemTypeNameChange}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, marginBottom: 5 }}>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <>
                    <Button onClick={handleCloseAddItemType} sx={{ bgcolor: '#F13C15', color: "black" }}>Cancel</Button>
                    <Button onClick={handleSaveItemType} sx={{ bgcolor: '#79AA45', color: "black", marginLeft: "20px" }}>Add</Button>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Dialog>

      </Grid>
      {showAlert()}
    </Container>
  );
}

export default ItemsScreen;