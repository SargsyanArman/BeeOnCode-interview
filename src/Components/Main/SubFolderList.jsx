import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from "@mui/material";

const bottomNavigationActionStyles = {
    display: "flex",
    flexDirection: "row",
    color: "black",
    gap: "10px",
    flex: 1,
    "& .MuiBottomNavigationAction-label": {
        fontSize: "15px",
    },
    "& .MuiBottomNavigationAction-icon": {
        fontSize: "24px",
    },
};

const SubfolderList = ({ folders }) => {
    if (folders.length === 0) {
        return <p>No subfolders found.</p>;
    }

    const { pathname } = useLocation();
    const [hover, setHover] = useState(-1);

    const handleMouseEnter = (index) => setHover(index);
    const handleMouseLeave = () => setHover(-1);

    const value = folders.findIndex((subfolderPath) => pathname === `/folder/${subfolderPath}`);

    return (
        <div>
            <BottomNavigation
                showLabels
                value={value}
                sx={{ justifyContent: "space-between", backgroundColor: "#f0f0f0" }}
            >
                {folders.map((subfolderPath, index) => (
                    <BottomNavigationAction
                        key={index}
                        component={Link}
                        to={`/folder/${subfolderPath}`}
                        label={subfolderPath.split('/').pop()}
                        sx={{
                            ...bottomNavigationActionStyles,
                            color: hover === index ? 'blue' : 'black',
                            textDecoration: 'none',
                        }}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </BottomNavigation>
            <Outlet />
        </div>
    );
};

export default SubfolderList;
