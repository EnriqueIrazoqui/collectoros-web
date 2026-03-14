import { Box, Button, Paper, TextField, Typography } from "@mui/material";

const LoginPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>
          Iniciar sesión
        </Typography>

        <TextField fullWidth label="Email" margin="normal" />
        <TextField fullWidth label="Password" type="password" margin="normal" />

        <Button fullWidth variant="contained" sx={{ mt: 2 }}>
          Entrar
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;