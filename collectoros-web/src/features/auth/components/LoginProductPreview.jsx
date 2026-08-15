import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

const LoginProductPreview = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 4,
        width: "100%",
        maxWidth: 620,
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Chip
            icon={<AutoAwesomeOutlinedIcon />}
            label="Automatic tracking"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Typography variant="h4" fontWeight={800}>
            Your collection, understood.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, maxWidth: 480 }}
          >
            Monitor market value and understand how your collection changes
            over time.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Collection value
              </Typography>

              <Typography variant="h6" fontWeight={800}>
                $84,920.40
              </Typography>

              <Typography
                variant="caption"
                color="success.main"
                fontWeight={700}
              >
                +8.4%
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Tracked items
              </Typography>

              <Typography variant="h6" fontWeight={800}>
                18
              </Typography>

              <Typography variant="caption" color="text.secondary">
                16 healthy
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box
          sx={{
            height: 130,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            p: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight={700}>
              Collection growth
            </Typography>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <TrendingUpOutlinedIcon color="success" fontSize="small" />

              <Typography
                variant="caption"
                color="success.main"
                fontWeight={700}
              >
                +6.8%
              </Typography>
            </Stack>
          </Stack>

          {[40, 70].map((top) => (
            <Box
              key={top}
              sx={{
                position: "absolute",
                left: 16,
                right: 16,
                top: `${top}%`,
                borderTop: "1px dashed",
                borderColor: "divider",
              }}
            />
          ))}

          <Box
            sx={{
              position: "absolute",
              left: "8%",
              right: "8%",
              bottom: "28%",
              height: 3,
              bgcolor: "success.main",
              borderRadius: 999,
              transform: "rotate(-5deg)",
              transformOrigin: "left center",
            }}
          />
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 3,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={700}>
                Nintendo Switch 2 Bundle
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Console
              </Typography>
            </Box>

            <Stack alignItems="flex-end">
              <Typography fontWeight={700}>
                $11,029.51
              </Typography>

              <Typography
                variant="caption"
                color="success.main"
                fontWeight={700}
              >
                +$739.51
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Typography variant="caption" color="text.secondary">
          Demo data for illustration purposes.
        </Typography>
      </Stack>
    </Paper>
  );
};

export default LoginProductPreview;