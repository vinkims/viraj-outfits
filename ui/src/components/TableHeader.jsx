import React from "react";
import {
  TableCell,
  TableHead, 
  TableRow
} from "@mui/material";

const TableHeader = ({ headerLabel }) => {

  return (
    <TableHead>
      <TableRow>
        {headerLabel.map((headerCell) => (
          <TableCell
            key={headerCell.id}
            sx={{ fontWeight: '600' }}
          >{headerCell.label}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;