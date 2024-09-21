import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import TextMuiShared from "../Components/Shared/TextMuiShared";
import ThemeModes from "../Components/Shared/ThemeModes";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { LangContext } from "../Contexts/LangContext";

const UnauthorizedAccess = () => {
  const mode = useSelector((state) => state.mode.mode);
  const { t } = useContext(LangContext);
  const prefix = "Unauthorized access page";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: mode === "dark" ? "#7a7a7a" : "white", height: { sx: '50vh', sm: '100vh' } }}
      p={2}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          maxWidth: 400,
          backgroundColor: mode === "dark" ? "black" : "white",
        }}
      >
        <ThemeModes tagName="div">
          <Stack spacing={2}>
            <Alert severity="error">
              <Typography variant="h5" fontWeight="bold">
                {t(`${prefix}.title`)}
              </Typography>
            </Alert>
            <TextMuiShared variant="body1" color="textSecondary">
              {t(`${prefix}.text`)}
            </TextMuiShared>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2, textTransform: "none" }}
            >
              {t(`${prefix}.signup`)}
            </Button>
            <TextMuiShared variant="body2" color="textSecondary">
              {t(`${prefix}.signin text`)}<Link to="/signin">{t(`${prefix}.signin`)}</Link>
            </TextMuiShared>
          </Stack>
        </ThemeModes>
      </Paper>
    </Box>
  );
};

export default UnauthorizedAccess;
