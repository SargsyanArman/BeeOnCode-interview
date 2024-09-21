import React, { useState } from 'react'
import { AccMenu } from './AccMenu'
import {
    Person as PersonIcon,
} from '@mui/icons-material';

const Header = () => {
    const [sign, setSign] = useState(null);

    const handleMenuClick = (event) => {
        setSign(event.currentTarget);
    };

    return (
        <div style={{ backgroundColor: 'red', height: '60px', display: 'flex', justifyContent: 'end', alignItems: 'center', paddingRight: '30px' }}>
            <PersonIcon onClick={handleMenuClick} sx={{ fontSize: '35px' }}> </PersonIcon>
            <AccMenu sign={sign} setSign={setSign} />
        </div>
    );
};

export default Header;
