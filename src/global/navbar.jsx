import { Box, IconButton, dividerClasses, iconButton } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import InputBase from "@mui/material/InputBase";
import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    let backgroundColor;
    if (colors && colors.primary) {
    backgroundColor = colors.primary[400];
    }

    return (<Box display="flex" justifyContent="space-between" p={2}>
        <Box 
        display="flex" 
        backgroundColor={backgroundColor}
        borderRadius="3px"
        >
            <InputBase sx={{ lm: 2, flex: 1}} placeholder="Buscar"/>
                <IconButton type="button" sx={{ p:1 }}>
                    <SearchIcon/>  
                </IconButton> 
        </Box>

        <Box display="flex">
            <IconButton type="button" sx={{ p:1 }}>
                <ShoppingCartOutlinedIcon/>
            </IconButton>
            <IconButton type="button" sx={{ p:1 }}>
                <SettingsOutlinedIcon/>
            </IconButton>
            <IconButton type="button" sx={{ p:1 }}>
                <NotificationsOutlinedIcon/>
            </IconButton>
            <IconButton type="button" sx={{ p:1 }}>
                <PersonOutlinedIcon/>
            </IconButton>
            <IconButton type="button" sx={{ p:1 }} onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? <LightModeOutlinedIcon/> : <DarkModeOutlinedIcon/>}
            </IconButton>
        </Box>
    </Box>);
}
export default Navbar;
