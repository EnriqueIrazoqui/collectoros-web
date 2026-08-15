import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-US");
}

function getStatusColor(status) {
  if (status === "approved") return "success";
  if (status === "rejected") return "error";

  return "warning";
}

function AdminAccessRequestsTable({
  requests = [],
  isSubmitting = false,
  onViewDetails,
  onApprove,
  onReject,
}) {
  if (requests.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          No access requests
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          There are no access requests to review right now.
        </Typography>
      </Paper>
    );
  }

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
      <Table sx={{ minWidth: 980 }}>
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
            <TableCell>Applicant</TableCell>
            <TableCell>Interest</TableCell>
            <TableCell>Requested At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {requests.map((request, index) => {
            const isLastRow = index === requests.length - 1;
            const isPending = request.status === "pending";

            return (
              <TableRow
                key={request.id}
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
                    <Typography fontWeight={700}>
                      {request.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {request.email}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ minWidth: 180 }}>
                  <Typography variant="body2">
                    {request.interest || "General"}
                  </Typography>
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {formatDate(request.createdAt)}
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                    }}
                  />
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    minWidth: 360,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1}
                    justifyContent="flex-end"
                    alignItems={{ xs: "stretch", md: "center" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onViewDetails?.(request)}
                      disabled={isSubmitting}
                      sx={{ minHeight: 36 }}
                    >
                      Details
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => onApprove?.(request)}
                      disabled={isSubmitting || !isPending}
                      sx={{ minHeight: 36 }}
                    >
                      Approve
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => onReject?.(request)}
                      disabled={isSubmitting || !isPending}
                      sx={{ minHeight: 36 }}
                    >
                      Reject
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

export default AdminAccessRequestsTable;