import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)({
    textDecoration: "none",
    color: "inherit",
    "&:hover": {
        textDecoration: "underline",
        color: "#a103fc",
        transition: "color 0.3s ease, text-decoration 0.3s ease",
    },
});

export { StyledLink };
