import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import WishlistRowActions from "./WishlistRowActions";
import { formatCurrency } from "../../../utils/formatCurrency";

const getPriorityColor = (priority) => {
  const normalized = String(priority || "").toLowerCase();

  if (normalized === "high") return "error";
  if (normalized === "medium") return "warning";
  if (normalized === "low") return "success";

  return "default";
};

const WishlistTable = ({ items = [], onViewItem, onEditItem, onDeleteItem }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              "& th": {
                borderBottom: "1px solid",
                borderColor: "divider",
                py: 2.5,
                fontWeight: 500,
                color: "text.primary",
              },
            }}
          >
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell align="right">Target price</TableCell>
            <TableCell align="right">Observed price</TableCell>
            <TableCell align="right">Delta to target</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item, index) => {
            const targetPrice = Number(item.targetPrice || 0);
            const observedPrice = Number(item.currentObservedPrice || 0);
            const delta = observedPrice - targetPrice;
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
                <TableCell>
                  <Box>
                    <Typography fontWeight={700}>{item.name}</Typography>

                    {item.description ? (
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    ) : null}
                  </Box>
                </TableCell>

                <TableCell>{item.category || "-"}</TableCell>

                <TableCell>
                  <Chip
                    label={item.priority || "Unknown"}
                    color={getPriorityColor(item.priority)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(targetPrice)}
                </TableCell>

                <TableCell align="right">
                  {formatCurrency(observedPrice)}
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    color: delta <= 0 ? "success.main" : "warning.main",
                    fontWeight: 700,
                  }}
                >
                  {delta > 0 ? "+" : ""}
                  {formatCurrency(delta)}
                </TableCell>

                <TableCell align="right">
                  <WishlistRowActions
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

export default WishlistTable;