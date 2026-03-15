import { Box, Typography } from "@mui/material";

const AppFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        pt: 3,
        pb: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        CollectorOS Web is being developed by member{" "}
        <strong>Yata Garasu</strong> of <strong>DevFam</strong>.
      </Typography>
    </Box>
  );
};

export default AppFooter;
