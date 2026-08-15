import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
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

function DetailRow({ label, children }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          mb: 0.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </Typography>

      {typeof children === "string" ? (
        <Typography variant="body1">
          {children || "-"}
        </Typography>
      ) : (
        children
      )}
    </Box>
  );
}

function AccessRequestDetailsDialog({
  open,
  request,
  onClose,
}) {
  const handleClose = (_, reason) => {
    if (reason === "backdropClick") return;

    onClose?.();
  };

  if (!request) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Access request
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Review the information submitted by this applicant.
            </Typography>
          </Box>

          <Chip
            label={request.status || "pending"}
            color={getStatusColor(request.status)}
            size="small"
            sx={{
              textTransform: "capitalize",
            }}
          />
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <DetailRow label="Name">
            {request.name || "-"}
          </DetailRow>

          <DetailRow label="Email">
            {request.email || "-"}
          </DetailRow>

          <DetailRow label="Interest">
            {request.interest || "General"}
          </DetailRow>

          <Divider />

          <DetailRow label="Message">
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {request.message || "No message provided."}
              </Typography>
            </Box>
          </DetailRow>

          <Divider />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
          >
            <Box sx={{ flex: 1 }}>
              <DetailRow label="Requested at">
                {formatDate(request.createdAt)}
              </DetailRow>
            </Box>

            <Box sx={{ flex: 1 }}>
              <DetailRow label="Reviewed at">
                {formatDate(request.reviewedAt)}
              </DetailRow>
            </Box>
          </Stack>

          {request.adminNotes ? (
            <>
              <Divider />

              <DetailRow label="Admin notes">
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.default",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {request.adminNotes}
                  </Typography>
                </Box>
              </DetailRow>
            </>
          ) : null}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccessRequestDetailsDialog;