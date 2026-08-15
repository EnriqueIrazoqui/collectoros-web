import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

const howItWorksSteps = [
  {
    title: "Add your item",
    description:
      "Create an inventory record with its purchase price, condition, category, quantity, and images.",
    icon: AddCircleOutlineIcon,
  },
  {
    title: "Enable tracking",
    description:
      "Add a compatible marketplace URL and let CollectorOS monitor the current value automatically.",
    icon: LinkOutlinedIcon,
  },
  {
    title: "Monitor value",
    description:
      "Background jobs periodically check the listing and keep the estimated value synchronized.",
    icon: SyncOutlinedIcon,
  },
  {
    title: "Build price history",
    description:
      "Every meaningful price change becomes part of the item's historical value timeline.",
    icon: ShowChartOutlinedIcon,
  },
  {
    title: "Understand your collection",
    description:
      "Compare purchase price, current value, gains, losses, and historical trends in one place.",
    icon: InsightsOutlinedIcon,
  },
];

const features = [
  {
    title: "Inventory Management",
    description:
      "Organize your collection, purchase prices, condition, quantity, images, and estimated value in one place.",
    icon: Inventory2OutlinedIcon,
  },
  {
    title: "Automatic Value Tracking",
    description:
      "Track compatible marketplace listings automatically and keep your collection values up to date.",
    icon: TrendingUpOutlinedIcon,
  },
  {
    title: "Price History",
    description:
      "Understand how the value of your collection changes over time with historical prices and trends.",
    icon: TimelineOutlinedIcon,
  },
  {
    title: "Smart Wishlist",
    description:
      "Track products you want to buy and monitor price changes without checking stores manually.",
    icon: FavoriteBorderOutlinedIcon,
  },
];

const PublicOverviewPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >

      {/* HERO */}
      <Container maxWidth="xl">
        <Grid
          container
          spacing={6}
          alignItems="center"
          sx={{
            minHeight: { xs: "auto", md: "78vh" },
            py: { xs: 8, md: 10 },
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3} maxWidth={650}>
              <Box>
                <Chip
                  label="Collection management, reimagined"
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "2.8rem",
                    sm: "3.8rem",
                    md: "4.6rem",
                  },
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                }}
              >
                Track, value and understand your collection.
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                fontWeight={400}
                sx={{
                  lineHeight: 1.7,
                  maxWidth: 580,
                }}
              >
                CollectorOS helps you organize your collection, monitor market
                values, track wishlist prices, and understand how your assets
                evolve over time.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/request-access")}
                >
                  Request access
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Button>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2.5}
                pt={1}
              >
                {[
                  "Smart inventory",
                  "Automatic tracking",
                  "Historical insights",
                ].map((label) => (
                  <Stack
                    key={label}
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                  >
                    <CheckCircleOutlineIcon
                      fontSize="small"
                      color="success"
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* DEMO CARD */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 5,
                p: { xs: 2.5, md: 4 },
                bgcolor: "background.paper",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                  >
                    Collection snapshot
                  </Typography>

                  <Typography variant="h4" fontWeight={800}>
                    ASUS ROG Ally X
                  </Typography>

                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip
                      label="Console"
                      size="small"
                      variant="outlined"
                    />

                    <Chip
                      label="Tracking healthy"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Purchase price
                      </Typography>

                      <Typography variant="h6" fontWeight={700}>
                        $10,290
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Current value
                      </Typography>

                      <Typography variant="h6" fontWeight={700}>
                        $11,029
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 3,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Gain
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="success.main"
                      >
                        +7.18%
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    p: 2.5,
                    minHeight: 190,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={3}
                  >
                    Price history
                  </Typography>

                  <Box
                    sx={{
                      height: 90,
                      position: "relative",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: "4%",
                        right: "4%",
                        bottom: "34%",
                        height: 3,
                        bgcolor: "success.main",
                        borderRadius: 999,
                        transform: "rotate(-3deg)",
                        transformOrigin: "left center",
                      }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* FEATURES */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          py: { xs: 8, md: 10 },
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1.5} mb={5}>
            <Typography
              variant="overline"
              color="primary.main"
            >
              Built for collectors
            </Typography>

            <Typography variant="h3" fontWeight={800}>
              Everything your collection needs.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              maxWidth={650}
            >
              From cataloging your collection to automatically monitoring its
              market value, CollectorOS keeps everything connected.
            </Typography>
          </Stack>

          <Grid container spacing={2.5}>
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Grid
                  key={feature.title}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 3,
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      height: "100%",
                    }}
                  >
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "action.hover",
                        }}
                      >
                        <Icon color="primary" />
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        lineHeight={1.7}
                      >
                        {feature.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            spacing={1.5}
            mb={6}
            alignItems="center"
            textAlign="center"
          >
            <Typography
              variant="overline"
              color="primary.main"
            >
              How it works
            </Typography>

            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                maxWidth: 760,
              }}
            >
              From collection entry to market insight.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 680,
                lineHeight: 1.8,
              }}
            >
              CollectorOS connects inventory management, automatic tracking,
              and historical analysis into one simple workflow.
            </Typography>
          </Stack>

          <Grid container spacing={2.5}>
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Grid
                  key={step.title}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 2.4,
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      height: "100%",
                      position: "relative",
                      transition:
                        "transform 0.2s ease, border-color 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            bgcolor: "action.hover",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <Icon color="primary" />
                        </Box>

                        <Typography
                          variant="h5"
                          fontWeight={800}
                          color="text.disabled"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        {step.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxWidth="lg">
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 8, md: 12 },
            p: { xs: 4, md: 7 },
            borderRadius: 5,
            textAlign: "center",
          }}
        >
          <Stack
            spacing={2.5}
            alignItems="center"
          >
            <Typography variant="h3" fontWeight={800}>
              Ready to explore CollectorOS?
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              maxWidth={620}
              sx={{
                lineHeight: 1.8,
              }}
            >
              Request access to CollectorOS and, once approved, you'll receive
              an invitation to create your account.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/request-access")}
              >
                Request access
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            justifyContent="space-between"
          >
            <Typography
              variant="body2"
              fontWeight={700}
            >
              CollectorOS
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Collection management, reimagined.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicOverviewPage;