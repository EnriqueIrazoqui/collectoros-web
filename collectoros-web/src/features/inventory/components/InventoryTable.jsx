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
  TablePagination,
} from "@mui/material";
import InventoryRowActions from "./InventoryRowActions";
import { formatCurrency } from "../../../utils/formatCurrency";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US");
}

const InventoryTable = ({
  items = [],
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onViewItem,
  onEditItem,
  onDeleteItem,
  onOpenPriceHistory,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "24px",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x pan-y",
      }}
    >
      <Box
        sx={{
          display: "inline-block",
          minWidth: "100%",
        }}
      >
        <Table
          sx={{
            minWidth: 1100,
            pr: 2,
            boxSizing: "border-box",
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: 2.5,
                  fontWeight: 500,
                  color: "text.primary",
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Purchase price</TableCell>
              <TableCell align="right">Purchase date</TableCell>
              <TableCell align="right">Estimated value</TableCell>
              <TableCell align="right">Gain / Loss</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item, index) => {
              const quantity = Number(item.quantity || 0);
              const purchaseValue = Number(item.purchasePrice || 0);
              const currentValue = Number(item.currentEstimatedValue || 0);
              const gain = currentValue - purchaseValue;
              const isLastRow = index === items.length - 1;

              return (
                <TableRow
                  key={item.id}
                  hover
                  sx={{
                    "& td": {
                      py: 2.75,
                      borderBottom: isLastRow ? "none" : "1px solid",
                      borderColor: "divider",
                      verticalAlign: "middle",
                    },
                  }}
                >
                  <TableCell sx={{ minWidth: 240 }}>
                    <Box>
                      <Typography fontWeight={700}>{item.name}</Typography>

                      {item.description ? (
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      ) : null}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {item.category || "-"}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {item.condition || "-"}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {quantity}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatCurrency(purchaseValue)}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatDate(item.purchaseDate)}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatCurrency(currentValue)}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color: gain >= 0 ? "success.main" : "error.main",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {gain > 0 ? "+" : ""}
                    {formatCurrency(gain)}
                  </TableCell>

                  <TableCell align="center" sx={{ minWidth: 180 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <InventoryRowActions
                        onView={() => onViewItem?.(item)}
                        onHistory={() => onOpenPriceHistory?.(item)}
                        onEdit={() => onEditItem?.(item)}
                        onDelete={() => onDeleteItem?.(item)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            pr: 1,
            boxSizing: "border-box",
            "& .MuiTablePagination-toolbar": {
              px: 2,
              minHeight: 52,
              justifyContent: "flex-end",
              alignItems: "center",
            },
            "& .MuiTablePagination-spacer": {
              flex: "1 1 auto",
            },
            "& .MuiTablePagination-selectLabel": {
              margin: 0,
              whiteSpace: "nowrap",
            },
            "& .MuiTablePagination-displayedRows": {
              margin: 0,
              whiteSpace: "nowrap",
            },
            "& .MuiTablePagination-actions": {
              marginLeft: 1,
              flexShrink: 0,
            },
          }}
        />
      </Box>
    </TableContainer>
  );
};

export default InventoryTable;
