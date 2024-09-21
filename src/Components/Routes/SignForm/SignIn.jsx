import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Copyright from "../../../helperComponents/Copyright";
import { StyledLink } from "../../Constants/SignFormConstants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setUser } from "../../../Store/Slices/UserSlices";

const defaultTheme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    handleLogin(email, password, dispatch, navigate);
  };

  const handleLogin = async (email, password, dispatch, navigate) => {
    const auth = getAuth();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken,
        })
      );
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid user credentials. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              fullWidth
              margin="normal"
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <StyledLink to="/forgotpassword" variant="body2">
                  Forgot password?
                </StyledLink>
              </Grid>
              <Grid item>
                <StyledLink to="/signup" variant="body2">
                  Don't have an account? Sign Up
                </StyledLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
