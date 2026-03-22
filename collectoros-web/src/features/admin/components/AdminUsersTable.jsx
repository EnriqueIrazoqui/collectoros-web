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
  Chip,
  Stack,
  Button,
} from "@mui/material";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US");
}

function AdminUsersTable({
  users = [],
  isSubmitting = false,
  currentUserId,
  onToggleRole,
  onToggleStatus,
}) {
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
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user, index) => {
            const isLastRow = index === users.length - 1;
            const isSelf = Number(user.id) === Number(currentUserId);

            return (
              <TableRow
                key={user.id}
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
                    <Typography fontWeight={700}>
                      {user.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === "admin" ? "secondary" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={user.isActive ? "Active" : "Inactive"}
                    color={user.isActive ? "success" : "error"}
                    size="small"
                  />
                </TableCell>

                <TableCell>{formatDate(user.createdAt)}</TableCell>

                <TableCell align="right">
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-end"
                    flexWrap="wrap"
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={isSubmitting || isSelf}
                      onClick={() => onToggleRole?.(user)}
                    >
                      {user.role === "admin" ? "Make User" : "Make Admin"}
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color={user.isActive ? "warning" : "success"}
                      disabled={isSubmitting || isSelf}
                      onClick={() => onToggleStatus?.(user)}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AdminUsersTable;