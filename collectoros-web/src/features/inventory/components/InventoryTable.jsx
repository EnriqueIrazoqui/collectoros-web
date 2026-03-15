import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import InventoryRowActions from "./InventoryRowActions";
import { formatCurrency } from "../../../utils/formatCurrency";

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-US");
};

const InventoryTable = ({ items = [], onViewItem, onEditItem, onDeleteItem }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Purchase price</TableCell>
            <TableCell align="right">Purchase date</TableCell>
            <TableCell align="right">Estimated value</TableCell>
            <TableCell align="right">Gain / Loss</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item) => {
            const quantity = Number(item.quantity || 0);
            const purchaseValue = Number(item.purchasePrice || 0);
            const currentValue = Number(item.currentEstimatedValue || 0);
            const gain = currentValue - purchaseValue;

            return (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Box>
                    <Typography fontWeight={600}>{item.name}</Typography>

                    {item.description ? (
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    ) : null}
                  </Box>
                </TableCell>

                <TableCell>{item.category || "-"}</TableCell>

                <TableCell>{item.condition || "-"}</TableCell>

                <TableCell align="right">{quantity}</TableCell>

                <TableCell align="right">
                  {formatCurrency(purchaseValue)}
                </TableCell>

                <TableCell align="right">
                  {formatDate(item.purchaseDate)}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(currentValue)}
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    color: gain >= 0 ? "success.main" : "error.main",
                    fontWeight: 600,
                  }}
                >
                  {gain > 0 ? "+" : ""}
                  {formatCurrency(gain)}
                </TableCell>

                <TableCell align="right">
                  <InventoryRowActions
                    onView={() => onViewItem?.(item)}
                    onEdit={() => onEditItem?.(item)}
                    onDelete={() => onDeleteItem?.(item)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;