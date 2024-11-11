import React from "react";
import { Button } from "@mui/material";
import Iconify from "./Iconify";

const AddButton = ({ title, handleClick }) => {

  return (
    <Button
      variant="contained"
      color="inherit"
      startIcon={<Iconify icon="eva:plus-fill" />}
      sx={{
        bgcolor: '#FF6E33',
        color: 'white',
        "&:hover": {
          color: 'black'
        },
        marginLeft: 5
      }}
      onClick={handleClick}
    >
      {title}
    </Button>
  );
}

export default AddButton;