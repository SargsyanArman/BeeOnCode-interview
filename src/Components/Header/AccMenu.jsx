import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {
    Person as PersonIcon,
    PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../Hooks/use-auth';
import { removeUser } from '../../Store/Slices/UserSlices';
import { StyledLink, MENU_STYLE } from '../Constants/MenuConstants';
import { fetchUser } from '../Constants/MenuConstants';

export const AccMenu = ({ sign, setSign }) => {
    const handleMenuClose = () => {
        setSign(null);
    };

    const navigate = useNavigate();
    const { isAuth, id } = useAuth();
    const [userData, setUserData] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuth && id) {
            fetchUser(id).then(setUserData);
        }
    }, [isAuth, id]);

    const handleLogout = () => {
        dispatch(removeUser());
        handleMenuClose();
        navigate('/');
    };

    const menuItems = isAuth
        ? [
            { to: '/', text: 'Log out', onClick: handleLogout, icon: <PersonIcon />, sx: { color: 'red' } },
        ]
        : [
            { to: '/signin', icon: <PersonIcon />, text: 'Sign in' },
            { to: '/signup', icon: <PersonAddIcon />, text: 'Sign Up' },
        ];

    return (
        <Menu
            id="accountMenu"
            anchorEl={sign}
            open={Boolean(sign)}
            onClose={handleMenuClose}
            PaperProps={{ sx: MENU_STYLE }}
            MenuListProps={{ sx: { py: 0 } }}
        >
            {menuItems.map((item, index) => (
                <StyledLink to={item.to} onClick={item?.onClick} key={index}>
                    <MenuItem onClick={handleMenuClose} sx={item.sx}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <Typography>{item.text}</Typography>
                    </MenuItem>
                </StyledLink>
            ))}
        </Menu>
    );
};


