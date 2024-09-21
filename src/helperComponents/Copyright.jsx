import { Typography } from "@mui/material";

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      {new Date().getFullYear()}
    </Typography>
  );
}
