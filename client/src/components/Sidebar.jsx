import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import DomainIcon from '@mui/icons-material/Domain';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const drawerWidth = 240;

const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Countries', icon: <PublicIcon />, path: '/countries' },
    { text: 'States', icon: <SouthAmericaIcon />, path: '/states' },
    { text: 'Districts', icon: <DomainIcon />, path: '/districts' },
    { text: 'Tehsils', icon: <CorporateFareIcon />, path: '/tehsils' },
    { text: 'Departments', icon: <BusinessIcon />, path: '/departments' },
    { text: 'Designations', icon: <AssignmentIndIcon />, path: '/designations' },
];

const Sidebar = () => {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <List>
                {menuItems.map((item) => (
                    <ListItem button component={Link} to={item.path} key={item.text}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar; 