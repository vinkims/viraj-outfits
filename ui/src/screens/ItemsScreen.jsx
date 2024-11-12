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
  const [ isItemCodeError, setIsItemCodeError ] = useState(false);
  const [ isItemTypeNameError, setIsItemTypeNameError ] = useState(false);
  const [ isNewCategoryError, setIsNewCategoryError ] = useState(false);
  const [ isNewColorError, setIsNewColorError ] = useState(false);
  const [ isNewItemCodeError, setIsNewItemCodeError ] = useState(false);
  const [ isNewItemTypeError, setIsNewItemTypeError ] = useState(false);
  const [ isNewNameError, setIsNewNameError ] = useState(false);
  const [ isNewPriceError, setIsNewPriceError ] = useState(false);
  const [ isNewSizeError, setIsNewSizeError ] = useState(false);
  const [ itemCode, setItemCode ] = useState('');
  const initialItemForm = {
    itemType: null,
    name: '',
    category: null,
    itemCode: '',
    color: '',
    size: '',
    price: ''
  };
  const initialItemFormErrors = {
    itemType: false,
    name: false,
    category: false,
    itemCode: false,
    color: false,
    size: false,
    price: false
  }
  const [ itemForm, setItemForm ] = useState(initialItemForm);
  const [ itemFormErrors, setItemFormErrors ] = useState(initialItemFormErrors);
  const [ itemId, setItemId ] = useState(null);
  const [ items, setItems ] = useState([]);
  const [ itemTypeName, setItemTypeName ] = useState('');
  const [ itemTypeNameErrorText, setItemTypeNameErrorText ] = useState('');
  const [ itemTypes, setItemTypes ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ newCategory, setNewCategory ] = useState('');
  const [ newCategoryErrorText, setNewCategoryErrorText ] = useState('');
  const [ newColor, setNewColor ] = useState('');
  const [ newColorErrorText, setNewColorErrorText ] = useState('');
  const [ newItemCode, setNewItemCode ] = useState('');
  const [ newItemCodeErrorText, setNewItemCodeErrorText ] = useState('');
  const [ newItemType, setNewItemType ] = useState(null);
  const [ newItemTypeErrorText, setNewItemTypeErrorText ] = useState('');
  const [ newName, setNewName ] = useState('');
  const [ newNameErrorText, setNewNameErrorText ] = useState('');
  const [ newPrice, setNewPrice ] = useState('');
  const [ newPriceErrorText, setNewPriceErrorText ] = useState('');
  const [ newSize, setNewSize ] = useState('');
  const [ newSizeErrorText, setNewSizeErrorText ] = useState('');
  const [ openAddItem, setOpenAddItem ] = useState(false);
  const [ openAddItemType, setOpenAddItemType ] = useState(false);
  const [ openAlert, setOpenAlert ] = useState(false);
  const [ openEditItem, setOpenEditItem ] = useState(false);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ pageSize, setPageSize ] = useState(10);
  const [ severity, setSeverity ] = useState('success');
  const [ totalResults, setTotalResults ] = useState(0);

  const headerLabels = [
    { id: 'itemCode', label: 'Item Code' },
    { id: 'itemType', label: 'Item Type' },
    { id: 'name', label: 'Name' },
    { id: 'category', label: 'Category' },
    { id: 'color', label: 'Color' },
    { id: 'size', label: 'Size' },
    { id: 'date', label: 'Date Added' },
    { id: 'price', label: 'Buying Price' },
    { id: 'sellingPrice', label: 'Selling Price' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
  ];

  useEffect(() => {
    getItems();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    getItemTypes();
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  const clearAddItemTypeDetails = () => {
    setItemTypeName('');
    setIsItemTypeNameError(false);
  }

  const clearEditItemDetails = () => {
    setNewItemType(null);
    setIsNewItemTypeError(false);
    setNewName('');
    setIsNewNameError(false);
    setNewCategory(null);
    setIsNewCategoryError(false);
    setNewItemCode('');
    setIsNewItemCodeError(false);
    setNewColor('');
    setIsNewColorError(false);
    setNewSize('');
    setIsNewSizeError(false);
    setNewPrice('');
    setIsNewPriceError(false);
  }

  const clearFormDetails = () => {
    setItemForm(initialItemForm);
    setItemFormErrors(initialItemFormErrors);
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

    let url = `item?pgSize=${pageSize}&pgNum=${pageNumber}`

    await ServerCommunicationUtils.get(url)
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        setItems(res.content.data);
        setPageNumber(res.content.pageInfo.pageNumber);
        setPageSize(res.content.pageInfo.pageSize);
        setTotalResults(res.content.pageInfo.totalResults);
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

  const getUpdatedFields = () => {
    const updatedFields = {};

    if (newItemType?.id !== itemForm.itemType?.id) {
      updatedFields.itemTypeId = newItemType.id;
    }
    if (newName !== itemForm.name) {
      updatedFields.name = newName;
    }
    if (newCategory?.id !== itemForm.category?.id) {
      updatedFields.categoryId = newCategory.id;
    }
    if (newItemCode !== itemForm.itemCode) {
      updatedFields.itemCode = newItemCode;
    }
    if (newColor !== itemForm.color) {
      updatedFields.color = newColor;
    }
    if (newSize !== itemForm.size) {
      updatedFields.size = newSize;
    }
    if (newPrice !== itemForm.price) {
      updatedFields.price = newPrice;
    }

    return updatedFields;
  }

  const handleAddItem = () => {
    setOpenAddItem(true);
  }

  const handleAddItemType = () => {
    setOpenAddItemType(true);
  }

  const handleCloseAddItem = (event, reason) => {
    if(reason === 'backdropClick') {
      return;
    }
    setOpenAddItem(false);
    clearFormDetails();
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

  const handleCloseEditItem = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }

    setOpenEditItem(false);
    clearEditItemDetails();
  }

  const handleEditItem = (itemObj) => {
    console.log("Item: ", itemObj);
    setOpenEditItem(true);
    setItemId(itemObj.id);

    const currentItemType = itemTypes.find(itm => itm.id === itemObj.itemType.id);
    const currentCategory = categories.find(cat => cat.id === itemObj.category.id);

    // set initial values
    setItemForm({
      itemType: currentItemType,
      name: itemObj.name,
      category: currentCategory,
      itemCode: itemObj.itemCode || '0',
      color: itemObj.color,
      size: itemObj.size || "",
      price: itemObj.price
    });

    setNewItemType(currentItemType);
    setNewName(itemObj.name);
    setNewCategory(currentCategory);
    setNewItemCode(itemObj.itemCode);
    setNewColor(itemObj.color);
    setNewSize(itemObj.size);
    setNewPrice(itemObj.price);
  }

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setItemForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setItemFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false // reset error on state change
    }));
  }

  const handleInputSelect = (field) => (_, event) => {
    setItemForm((prevForm) => ({
      ...prevForm,
      [field]: event
    }));
    setItemFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));
  }

  const handleItemTypeNameChange = (event) => {
    const typeName = event.target.value;
    setItemTypeName(typeName);
    setIsItemTypeNameError(false);
  }

  const handleNewCategorySelect = (_, value) => {
    setNewCategory(value);
  }

  const handleNewColorChange = (event) => {
    const colorValue = event.target.value;
    setNewColor(colorValue);
    setIsNewColorError(false);
  }

  const handleNewItemCodeChange = (event) => {
    const codeValue = event.target.value;
    setItemCode(codeValue);
    setIsItemCodeError(false);
  }

  const handleNewItemTypeSelect = (_, value) => {
    setNewItemType(value);
  }

  const handleNewNameChange = (event) => {
    const nameValue = event.target.value;
    setNewName(nameValue);
    setIsNewNameError(false);
  }

  const handleNewPriceChange = (event) => {
    const priceValue = event.target.value;
    setNewPrice(priceValue);
    setIsNewPriceError(false);
  }

  const handleNewSizeChange = (event) => {
    const sizeValue = event.target.value;
    setNewSize(sizeValue);
    setIsNewSizeError(false);
  }

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  }

  const handleRowsPerPageChange = (event) => {
    setPageNumber(0);
    setPageSize(parseInt(event.target.value), 10);
  }

  const handleSaveItem = async () => {
    if (!validateForm()) {
      return;
    }

    let payload = {};
    payload.name = itemForm.name;
    payload.itemTypeId = itemForm.itemType?.id;
    payload.categoryId = itemForm.category?.id;
    payload.itemCode = itemForm.itemCode;
    payload.color = itemForm.color;
    payload.size = itemForm.size;
    payload.price = itemForm.price;

    setLoading(true);

    await ServerCommunicationUtils.post("item", payload)
    .then(res => {
      if (res.status === 201) {
        setLoading(false);
        setOpenAlert(true);
        setSeverity('success');
        setAlertMessage('Item added successfully');
        setOpenAddItem(false);
        clearFormDetails();
        getItems();
      } else if (res.status === 403){
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Item could not be added. Try again later.'
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

  const handleUpdateItem = async () => {
    const conditions = [
      {
        value: newItemType,
        setError: setIsNewItemTypeError,
        setErrorText: setNewItemTypeErrorText,
        errorMessage: 'Please select item type'
      },
      {
        value: newName,
        setError: setIsNewNameError,
        setErrorText: setNewNameErrorText,
        errorMessage: 'Please enter name'
      },
      {
        value: newCategory,
        setError: setIsNewCategoryError,
        setErrorText: setNewCategoryErrorText,
        errorMessage: 'Please select category'
      },
      {
        value: newColor,
        setError: setIsNewColorError,
        setErrorText: setNewColorErrorText,
        errorMessage: 'Please enter color'
      },
      {
        value: newPrice,
        setError: setIsNewPriceError,
        setErrorText: setNewPriceErrorText,
        errorMessage: 'Please enter price'
      }
    ];

    const errorMessages = ValidationUtils.validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    const updatedFields = getUpdatedFields();

    if (Object.keys(updatedFields).length === 0) {
      setOpenAlert(true);
      setSeverity('info');
      setAlertMessage("No changes detected");
      return;
    }

    setLoading(true);

    await ServerCommunicationUtils.patch(`item/${itemId}`, updatedFields)
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        setOpenAlert(true);
        setSeverity('success');
        setAlertMessage('Item updated successfully');
        setOpenEditItem(false);
        clearEditItemDetails();
        getItems();
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Item could not be updated. Try again later.'
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
        setAlertMessage('Error updating item');
      }
    })
  }

  const logoutUser = () => {
    logout();
    navigate("/login");
  }

  const validateForm = () => {
    const errors = {};

    if (!itemForm.itemType) {
      errors.itemType = true;
    }
    if (!itemForm.name) {
      errors.name = true;
    }
    if (!itemForm.category) {
      errors.category = true;
    }
    if (!itemForm.itemCode) {
      errors.itemCode = true;
    }
    if (!itemForm.color) {
      errors.color = true;
    }
    if (!itemForm.size) {
      errors.size = true;
    }
    if (!itemForm.price) {
      errors.price = true;
    }

    setItemFormErrors(errors);

    return Object.keys(errors).length === 0;
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
                  <TableCell>{row.sellingPrice}</TableCell>
                  <TableCell>{row.status.name}</TableCell>
                  <TableCell>
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:edit-fill" />}
                        sx={{ marginRight: 2, textTransform: 'none' }}
                        onClick={() => handleEditItem(row)}
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
                value={itemForm.itemType}
                onChange={handleInputSelect('itemType')}
                options={itemTypes}
                sx={{ flex:1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item Type"
                    variant="outlined"
                    required
                    margin="dense"
                    error={itemFormErrors.itemType}
                    helperText={itemFormErrors.itemType && 'Please select item type'}
                  />
                )}
              />
              <TextField
                margin="dense"
                label="Name"
                name="name"
                error={itemFormErrors.name}
                helperText={itemFormErrors.name && 'Please enter a valid name'}
                required
                sx={{ marginLeft: "10px", flex: 1 }}
                value={itemForm.name}
                onChange={handleInputChange('name')}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
              <Autocomplete
                value={itemForm.category}
                onChange={handleInputSelect('category')}
                options={categories}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Category"
                    variant="outlined"
                    required
                    error={itemFormErrors.category}
                    helperText={itemFormErrors.category && 'Please select category'}
                  />
                )}
              />
              <TextField
                margin="dense"
                label="Item Code"
                name="itemCode"
                sx={{ marginLeft: "10px", flex: 1 }}
                value={itemForm.itemCode}
                onChange={handleInputChange('itemCode')}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
              <TextField
                margin="dense"
                label="Color"
                name="color"
                error={itemFormErrors.color}
                helperText={itemFormErrors.color && 'Please enter color'}
                value={itemForm.color}
                required
                onChange={handleInputChange('color')}
                sx={{ flex: 1 }}
              />
              <TextField
                margin="dense"
                label="Size"
                name="size"
                value={itemForm.size}
                onChange={handleInputChange('size')}
                sx={{ flex: 1, marginLeft: "10px" }}
              />
              <TextField
                margin="dense"
                label="Price"
                name="price"
                error={itemFormErrors.price}
                helperText={itemFormErrors.price && 'Plase enter price'}
                value={itemForm.price}
                required
                onChange={handleInputChange('price')}
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

        <Dialog
          open={openEditItem}
          onClose={handleCloseEditItem}
          PaperProps={{ sx: { width: "500px" } }}
        >
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Autocomplete
                value={newItemType}
                onChange={handleNewItemTypeSelect}
                options={itemTypes}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Item Type"
                    variant="outlined"
                    required
                    error={isNewItemTypeError}
                    helperText={isNewItemTypeError ? newItemTypeErrorText : ''}
                  />
                )}
              />
              <TextField
                margin="dense"
                label="Name"
                name="name"
                sx={{ marginLeft: "10px", flex: 1}}
                required
                error={isNewNameError}
                helperText={isNewNameError ? newNameErrorText : ''}
                value={newName}
                onChange={handleNewNameChange}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
              <Autocomplete
                value={newCategory}
                onChange={handleNewCategorySelect}
                options={categories}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Category"
                    variant="outlined"
                    required
                    error={isNewCategoryError}
                    helperText={isNewCategoryError ? newCategoryErrorText : ''}
                  />
                )}
              />
              <TextField
                margin="dense"
                label="Item Code"
                name="itemCode"
                sx={{ marginLeft: "10px", flex: 1 }}
                error={isNewItemCodeError}
                helperText={isNewItemCodeError ? newItemCodeErrorText : ''}
                value={newItemCode}
                onChange={handleNewItemCodeChange}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
              <TextField
                margin="dense"
                label="Color"
                name="color"
                required
                sx={{ flex:1 }}
                error={isNewColorError}
                helperText={isNewColorError ? newColorErrorText : ''}
                value={newColor}
                onChange={handleNewColorChange}
              />
              <TextField
                margin="dense"
                label="Size"
                name="size"
                sx={{ flex: 1, marginLeft: "10px" }}
                error={isNewSizeError}
                helperText={isNewSizeError ? newSizeErrorText : ''}
                value={newSize}
                onChange={handleNewSizeChange}
              />
              <TextField
                margin="dense"
                label="Price"
                name="price"
                sx={{ flex: 1, marginLeft: "10px" }}
                required
                error={isNewPriceError}
                helperText={isNewPriceError ? newPriceErrorText : ''}
                value={newPrice}
                onChange={handleNewPriceChange}
              />
            </Box>
          </DialogContent>
          <Box display="flex" justifyContent="center" marginTop="5px" marginBottom="10px">
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <>
                <Button onClick={handleCloseEditItem} sx={{ bgcolor: '#F13C15', color: "black" }}>Cancel</Button>
                <Button onClick={handleUpdateItem} sx={{ bgcolor: '#79AA45', color: "black", marginLeft: "20px" }}>Save</Button>
              </>
            )}
          </Box>
        </Dialog>

      </Grid>
      {showAlert()}
    </Container>
  );
}

export default ItemsScreen;