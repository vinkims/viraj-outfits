import React from "react";
import { Box, Button } from "@mui/material";
import Loading from "./Loading";

const DialogButtons = ({ loading, cancelTitle, handleCancel, submitTitle, handleSubmit }) => {
  return (
    <Box display="flex" justifyContent="center" marginTop="5px" marginBottom="10px">
      {loading ? (
        <Loading/>
      ) : (
        <>
          <Button 
            sx={{ bgcolor: "#F13C15", color:"black" }}
            onClick={handleCancel}
          >
            {cancelTitle}
          </Button>
          <Button 
            sx={{ bgcolor: "#79AA45", color: "black", marginLeft: "20px"}}
            onClick={handleSubmit}
          >
            {submitTitle}
          </Button>
        </>
      )}
    </Box>
  );
}

export default DialogButtons;