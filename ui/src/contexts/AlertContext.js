import React, { createContext, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [ alertMessage, setAlertMessage ] = useState('');
  const [ openAlert, setOpenAlert ] = useState(false);
  const [ severity, setSeverity ] = useState('info');

  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setSeverity(severity);
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
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
    </AlertContext.Provider>
  );
}