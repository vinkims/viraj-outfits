import React, { useEffect, useState } from "react";
import { 
  Autocomplete, 
  Box, 
  Button, 
  Container, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Grid, 
  Paper, 
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

import { useAlert } from "../contexts/AlertContext";
import { useAuth } from "../contexts/Auth";
import { AddButton, DialogButtons, Iconify, Loading, TableHeader } from "../components";
import FormattingUtils from "../utils/FormattingUtils";
import ServerCommunicationUtils from "../utils/ServerCommunicationUtils";
import ValidationUtils from "../utils/ValidationUtils";

const ItemsScreen = () => {
  const { showAlert } = useAlert();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [ categories, setCategories ] = useState('');
  const [ isItemTypeNameError, setIsItemTypeNameError ] = useState(false);
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
  };
  const initialItemSaleForm = {
    sellingPrice: '',
    saleType: null,
    discount: '',
    paymentChannel: null,
    reference: ''
  };
  const initialItemSaleFormErrors = {
    sellingPrice: false,
    saleType: false,
    discount: false,
    paymentChannel: false,
    reference: false
  };
  const [ itemForm, setItemForm ] = useState(initialItemForm);
  const [ itemFormErrors, setItemFormErrors ] = useState(initialItemFormErrors);
  const [ itemId, setItemId ] = useState(null);
  const [ items, setItems ] = useState([]);
  const [ itemSaleForm, setItemSaleForm ] = useState(initialItemSaleForm);
  const [ itemSaleFormErrors, setItemSaleFormErrors ] = useState(initialItemSaleFormErrors);
  const [ itemTypeName, setItemTypeName ] = useState('');
  const [ itemTypeNameErrorText, setItemTypeNameErrorText ] = useState('');
  const [ itemTypes, setItemTypes ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ newItemForm, setNewItemForm ] = useState(initialItemForm);
  const [ newItemFormErrors, setNewItemFormErrors ] = useState(initialItemFormErrors);
  const [ openAddItem, setOpenAddItem ] = useState(false);
  const [ openAddItemType, setOpenAddItemType ] = useState(false);
  const [ openEditItem, setOpenEditItem ] = useState(false);
  const [ openSellItem, setOpenSellItem ] = useState(false);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ pageSize, setPageSize ] = useState(10);
  const [ paymentChannels, setPaymentChannels ] = useState([]);
  const [ saleTypes, setSaleTypes ] = useState([]);
  const [ totalResults, setTotalResults ] = useState(0);
  const inStockStatus = 10;

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

  useEffect(() => {
    getSaleTypes();
  }, []);

  useEffect(() => {
    getPaymentChannels();
  }, []);
  
  const clearFormDetails = () => {
    setItemForm(initialItemForm);
    setItemFormErrors(initialItemFormErrors);
    setNewItemForm(initialItemForm);
    setNewItemFormErrors(initialItemFormErrors);
  }

  const clearSaleFormDetails = () => {
    setItemSaleForm(initialItemSaleForm);
    setItemSaleFormErrors(initialItemSaleFormErrors);
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
        showAlert('Error fetching categories', 'error');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection.'
        : 'Error fetching categories.';
      showAlert(alertMsg, 'error');
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
        let pageInfo = res.content.pageInfo;
        setPageNumber(pageInfo.pageNumber);
        setPageSize(pageInfo.pageSize);
        setTotalResults(pageInfo.totalResults);
      } else {
        setLoading(false);
        showAlert('Error fetching items', 'error');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection.'
        : 'Error fetching items.';
      showAlert(alertMsg, 'error');
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
        showAlert('Error fetching item types', 'error');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection.'
        : 'Error fetching item types.';
      showAlert(alertMsg, 'error');
    })
  }

  const getPaymentChannels = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get("payment/channel")
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        const formattedChannels = res.content.data
          .filter((channel) => channel.id !== 3)
          .map((channel) => ({ id: channel.id, label: channel.name}));
        setPaymentChannels(formattedChannels);
      } else {
        setLoading(false);
        showAlert('Error fetching payment channels', 'error');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection.'
        : 'Error fetching payment channels.';
      showAlert(alertMsg, 'error');
    })
  }

  const getSaleTypes = async () => {
    setLoading(true);

    await ServerCommunicationUtils.get("sale/type")
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        const formattedSaleTypes = res.content.data.map((type) => ({ id: type.id, label: type.name}));
        setSaleTypes(formattedSaleTypes);
      } else {
        setLoading(false);
        showAlert('Error fetching sale types', 'error');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection.'
        : 'Error fetching sale types.';
      showAlert(alertMsg, 'error');
    })
  }

  const getUpdatedFields = () => {
    const updatedFields = {};

    if (newItemForm.itemType?.id !== itemForm.itemType?.id) {
      updatedFields.itemTypeId = newItemForm.itemType.id;
    }
    if (newItemForm.name !== itemForm.name) {
      updatedFields.name = newItemForm.name;
    }
    if (newItemForm.category?.id !== itemForm.category?.id) {
      updatedFields.categoryId = newItemForm.category.id;
    }
    if (newItemForm.itemCode !== itemForm.itemCode) {
      updatedFields.itemCode = newItemForm.itemCode;
    }
    if (newItemForm.color !== itemForm.color) {
      updatedFields.color = newItemForm.color;
    }
    if (newItemForm.size !== itemForm.size) {
      updatedFields.size = newItemForm.size;
    }
    if (newItemForm.price !== itemForm.price) {
      updatedFields.price = newItemForm.price;
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

  const handleCloseEditItem = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenEditItem(false);
    clearFormDetails();
  }

  const handleCloseSellItem = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenSellItem(false);
    clearSaleFormDetails();
  }

  const handleEditItem = (itemObj) => {
    setOpenEditItem(true);
    setItemId(itemObj.id);

    const currentItemType = itemTypes.find(itm => itm.id === itemObj.itemType.id);
    const currentCategory = categories.find(cat => cat.id === itemObj.category.id);

    // set initial values
    setItemForm({
      itemType: currentItemType,
      name: itemObj.name,
      category: currentCategory,
      itemCode: itemObj.itemCode,
      color: itemObj.color,
      size: itemObj.size,
      price: itemObj.price
    });

    setNewItemForm({
      itemType: currentItemType,
      name: itemObj.name,
      category: currentCategory,
      itemCode: itemObj.itemCode,
      color: itemObj.color,
      size: itemObj.size,
      price: itemObj.price
    })
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

  const handleNewInputChange = (field) => (event) => {
    const value = event.target.value;
    setNewItemForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setNewItemFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false // reset error on state change
    }));
  }

  const handleNewInputSelect = (field) => (_, event) => {
    setNewItemForm((prevForm) => ({
      ...prevForm,
      [field]: event
    }));
    setNewItemFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));
  }

  const handlePageChange = (event, newPage) => {
    setPageNumber(newPage);
  }

  const handleRowsPerPageChange = (event) => {
    setPageNumber(0);
    setPageSize(parseInt(event.target.value), 10);
  }

  const handleSaleInputChange = (field) => (event) => {
    const value = event.target.value;
    setItemSaleForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
    setItemSaleFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));
  }

  const handleSaleInputSelect = (field) => (_, event) => {
    setItemSaleForm((prevForm) => ({
      ...prevForm,
      [field]: event
    }));
    setItemSaleFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: false
    }));
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
        showAlert('Item added successfully', 'success');
        handleCloseAddItem();
        getItems();
      } else if (res.status === 403){
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Item could not be added. Try again later.'
          : res.detail;
        setLoading(false);
        showAlert(alertMsg, 'error');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection.'
        : 'Error adding item.';
      showAlert(alertMsg, 'error');
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
        showAlert('Item type created successfully', 'success');
        handleCloseAddItemType();
        getItemTypes();
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Item type could not be added. Please try again.'
          : res.detail;
        setLoading(false);
        showAlert(alertMsg, 'error');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection.'
        : 'Error adding item type.';
      showAlert(alertMsg, 'error');
    })
  }

  const handleSellItem = (itemObj) => {
    setOpenSellItem(true);
    setItemId(itemObj.id);
  }

  const handleSubmitSellItem = async () => {
    if (!validateSaleForm()) {
      return;
    }

    let payload = {};
    payload.amount = itemSaleForm.sellingPrice;
    payload.itemId = itemId;
    payload.paymentChannelId = itemSaleForm.paymentChannel?.id;
    payload.saleTypeId = itemSaleForm.saleType?.id;

    setLoading(true);

    await ServerCommunicationUtils.post("sale", payload)
    .then(res => {
      if (res.status === 201) {
        setLoading(false);
        showAlert('Item sold successfully', 'success');
        handleCloseSellItem();
        getItems();
      } else if (res.status === 403) {
        logout();
      } else {
        const alertMsg = res.status === 500
          ? 'Item could not be sold. Try again later.'
          : res.detail;
        setLoading(false);
        showAlert(alertMsg, 'error');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection.'
        : 'Error selling item.';
      showAlert(alertMsg, 'error');
    })
  }

  const handleUpdateItem = async () => {
    if (!validateNewForm()) {
      return;
    }

    const updatedFields = getUpdatedFields();

    if (Object.keys(updatedFields).length === 0) {
      showAlert('No changes detected', 'info');
      return;
    }

    setLoading(true);

    await ServerCommunicationUtils.patch(`item/${itemId}`, updatedFields)
    .then(res => {
      if (res.status === 200) {
        setLoading(false);
        showAlert('Item updated successfully', 'success');
        handleCloseEditItem();
        getItems();
      } else if (res.status === 403) {
        logoutUser();
      } else {
        const alertMsg = res.status === 500
          ? 'Item could not be updated. Try again later.'
          : res.detail;
        setLoading(false);
        showAlert(alertMsg, 'error');
      }
    })
    .catch(error => {
      console.error("Error: ", error);
      setLoading(false);
      let alertMsg = error.toString().includes('NetworkError when attempting to fetch resource')
        ? 'Please check your internet connection.'
        : 'Error updating item.';
      showAlert(alertMsg, 'error');
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

  const validateNewForm = () => {
    const errors = {};

    if (!newItemForm.itemType) {
      errors.itemType = true;
    }
    if (!newItemForm.name) {
      errors.name = true;
    }
    if (!newItemForm.category) {
      errors.category = true;
    }
    if (!newItemForm.itemCode) {
      errors.itemCode = true;
    }
    if (!newItemForm.color) {
      errors.color = true;
    }
    if (!newItemForm.size) {
      errors.size = true;
    }
    if (!newItemForm.price) {
      errors.price = true;
    }

    setNewItemFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  const validateSaleForm = ()=> {
    const errors = {};

    if (!itemSaleForm.paymentChannel) {
      errors.paymentChannel = true;
    }
    if (!itemSaleForm.saleType) {
      errors.saleType = true;
    }
    if (!itemSaleForm.sellingPrice) {
      errors.sellingPrice = true;
    }

    setItemSaleFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  return (
    <Container sx={{ maxWidth: '100vw !important', justifyContent: 'center', paddingTop: "50px" }}>
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
                  <TableCell sx={{ fontSize: "13px" }}>{row.itemCode}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.itemType.name}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.name}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.category.name}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.color}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.size}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{FormattingUtils.formatDate(row.createdOn)}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{FormattingUtils.formatAmount(row.price)}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.sellingPrice}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.status.name}</TableCell>
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

                      {row.status.id === inStockStatus && <Button
                        variant="outlined"
                        color="success"
                        startIcon={<Iconify icon="eva:shopping-cart-fill" />}
                        sx={{ textTransform: 'none' }}
                        onClick={() => handleSellItem(row)}
                      >
                        Sell
                      </Button>}
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
                helperText={itemFormErrors.price && 'Please enter price'}
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
              <Loading />
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
                  <Loading/>
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
                value={newItemForm.itemType}
                onChange={handleNewInputSelect('itemType')}
                options={itemTypes}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Item Type"
                    variant="outlined"
                    required
                    error={newItemFormErrors.itemType}
                    helperText={newItemFormErrors.itemType && 'Please select item type'}
                  />
                )}
              />
              <TextField
                margin="dense"
                label="Name"
                name="name"
                sx={{ marginLeft: "10px", flex: 1}}
                required
                error={newItemFormErrors.name}
                helperText={newItemFormErrors.name && 'Please enter a valied name'}
                value={newItemForm.name}
                onChange={handleNewInputChange('name')}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
              <Autocomplete
                value={newItemForm.category}
                onChange={handleNewInputSelect('category')}
                options={categories}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Category"
                    variant="outlined"
                    required
                    error={newItemFormErrors.category}
                    helperText={newItemFormErrors.category && 'Please select category'}
                  />
                )}
              />
              <TextField
                margin="dense"
                label="Item Code"
                name="itemCode"
                sx={{ marginLeft: "10px", flex: 1 }}
                value={newItemForm.itemCode}
                onChange={handleNewInputChange('itemCode')}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%" marginTop="10px">
              <TextField
                margin="dense"
                label="Color"
                name="color"
                required
                sx={{ flex:1 }}
                error={newItemFormErrors.color}
                helperText={newItemFormErrors.color && 'Please enter color'}
                value={newItemForm.color}
                onChange={handleNewInputChange('color')}
              />
              <TextField
                margin="dense"
                label="Size"
                name="size"
                sx={{ flex: 1, marginLeft: "10px" }}
                value={newItemForm.size}
                onChange={handleNewInputChange('size')}
              />
              <TextField
                margin="dense"
                label="Price"
                name="price"
                sx={{ flex: 1, marginLeft: "10px" }}
                required
                error={newItemFormErrors.price}
                helperText={newItemFormErrors.price && 'Please enter price'}
                value={newItemForm.price}
                onChange={handleNewInputChange('price')}
              />
            </Box>
          </DialogContent>
          <DialogButtons
            loading={loading}
            cancelTitle="Cancel"
            handleCancel={handleCloseEditItem}
            submitTitle="Save"
            handleSubmit={handleUpdateItem}
          />
        </Dialog>

        <Dialog
          open={openSellItem}
          onClose={handleCloseSellItem}
          PaperProps={{ sx: { width: "400px" } }}
        >
          <DialogTitle>Sell Item</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" width="100%">
              <Autocomplete
                value={itemSaleForm.saleType}
                onChange={handleSaleInputSelect('saleType')}
                options={saleTypes}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    variant="outlined"
                    label="Sale Type"
                    required
                    error={itemSaleFormErrors.saleType}
                    helperText={itemSaleFormErrors.saleType && 'Please select sale type'}
                  />
                )}
              />
              <Box display="flex" justifyContent="space-between" width="100%">
                <TextField
                  margin="dense"
                  label="Selling Price"
                  name="sellingPrice"
                  required
                  sx={{ flex: 1 }}
                  error={itemSaleFormErrors.sellingPrice}
                  helperText={itemSaleFormErrors.sellingPrice && 'Please enter selling price'}
                  value={itemSaleForm.sellingPrice}
                  onChange={handleSaleInputChange('sellingPrice')}
                />
                <TextField
                  margin="dense"
                  label="Discount"
                  name="discount"
                  sx={{ flex: 1, marginLeft: "10px" }}
                  error={itemSaleFormErrors.discount}
                  helperText={itemSaleFormErrors.discount && 'Please enter discount'}
                  value={itemSaleForm.discount}
                  onChange={handleSaleInputChange('discount')}
                />
              </Box>
              <Autocomplete
                value={itemSaleForm.paymentChannel}
                onChange={handleSaleInputSelect('paymentChannel')}
                options={paymentChannels}
                sx={{ flex: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    variant="outlined"
                    label="Payment Channel"
                    required
                    error={itemSaleFormErrors.paymentChannel}
                    helperText={itemSaleFormErrors.paymentChannel && 'Please select payment channel'}
                  />
                )}
              />
              {itemSaleForm.paymentChannel && (itemSaleForm.paymentChannel.id === 2 || itemSaleForm.paymentChannel.id === 4) &&
              <TextField
                margin="dense"
                label="Reference"
                name="reference"
                sx={{ flex: 1 }}
                error={itemSaleFormErrors.reference}
                helperText={itemSaleFormErrors.reference && 'Please enter reference'}
                value={itemSaleForm.reference}
                onChange={handleSaleInputChange('reference')}
              />
              }
            </Box>
          </DialogContent>
          <DialogButtons
            loading={loading}
            cancelTitle="Cancel"
            handleCancel={handleCloseSellItem}
            submitTitle="Sell"
            handleSubmit={handleSubmitSellItem}
          />
        </Dialog>

      </Grid>
    </Container>
  );
}

export default ItemsScreen;