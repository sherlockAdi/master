import React, { useState, useEffect } from 'react';
import stateService from '../services/stateService';
import countryService from '../services/countryService';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

const StatesPage = () => {
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentState, setCurrentState] = useState(null);
    const [formData, setFormData] = useState({ conid: '', state: '', status: true, archive: false });

    useEffect(() => {
        loadStates();
        loadCountries();
    }, []);

    const loadStates = async () => {
        const response = await stateService.getAllStates();
        setStates(response.data);
    };
    
    const loadCountries = async () => {
        const response = await countryService.getAllCountries();
        setCountries(response.data);
    };

    const handleOpen = (state = null) => {
        setCurrentState(state);
        if (state) {
            setFormData({ conid: state.conid, state: state.state, status: state.status, archive: state.archive });
        } else {
            setFormData({ conid: '', state: '', status: true, archive: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentState(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        if (currentState) {
            await stateService.updateState(currentState.stateid, formData);
        } else {
            await stateService.createState(formData);
        }
        loadStates();
        handleClose();
    };

    const handleDelete = async (id) => {
        await stateService.deleteState(id);
        loadStates();
    };

    const getCountryName = (conid) => {
        const country = countries.find(c => c.conid === conid);
        return country ? country.country : '';
    }

    return (
        <div>
            <h2>States</h2>
            <Button variant="contained" onClick={() => handleOpen()}>Add State</Button>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Archive</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {states.map((state) => (
                            <TableRow key={state.stateid}>
                                <TableCell>{state.stateid}</TableCell>
                                <TableCell>{state.state}</TableCell>
                                <TableCell>{getCountryName(state.conid)}</TableCell>
                                <TableCell>{state.status ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{state.archive ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(state)}>Edit</Button>
                                    <Button onClick={() => handleDelete(state.stateid)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentState ? 'Edit State' : 'Add State'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="state"
                        label="State Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.state}
                        onChange={handleChange}
                    />
                     <FormControl fullWidth margin="dense">
                        <InputLabel>Country</InputLabel>
                        <Select
                            name="conid"
                            value={formData.conid}
                            onChange={handleChange}
                        >
                            {countries.map(country => (
                                <MenuItem key={country.conid} value={country.conid}>
                                    {country.country}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox checked={formData.status} onChange={handleChange} name="status" />}
                        label="Active"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={formData.archive} onChange={handleChange} name="archive" />}
                        label="Archive"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default StatesPage; 