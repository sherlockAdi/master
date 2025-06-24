import React, { useState, useEffect } from 'react';
import districtService from '../services/districtService';
import stateService from '../services/stateService';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel,
    Select, MenuItem, FormControl, InputLabel, CircularProgress, Typography, Box, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DistrictsPage = () => {
    const [districts, setDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentDistrict, setCurrentDistrict] = useState(null);
    const [formData, setFormData] = useState({ district_name: '', stateid: '', status: true, archive: false });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [distResponse, stateResponse] = await Promise.all([
                districtService.getAllDistricts(),
                stateService.getAllStates()
            ]);
            setDistricts(distResponse.data);
            setStates(stateResponse.data);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDistricts = async () => {
        const response = await districtService.getAllDistricts();
        setDistricts(response.data);
    };

    const handleOpen = (district = null) => {
        setCurrentDistrict(district);
        if (district) {
            setFormData({ district_name: district.district_name, stateid: district.stateid, status: !!district.status, archive: !!district.archive });
        } else {
            setFormData({ district_name: '', stateid: '', status: true, archive: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDistrict(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        if (currentDistrict) {
            await districtService.updateDistrict(currentDistrict.district_id, formData);
        } else {
            await districtService.createDistrict(formData);
        }
        loadDistricts();
        handleClose();
    };

    const handleDelete = async (id) => {
        await districtService.deleteDistrict(id);
        loadDistricts();
    };
    
    const getStateName = (stateid) => {
        const state = states.find(s => s.stateid === stateid);
        return state ? state.state : 'N/A';
    }

    return (
        <Paper sx={{ p: 2, margin: 'auto', maxWidth: 1200, flexGrow: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Districts</Typography>
                <Button variant="contained" onClick={() => handleOpen()}>Add District</Button>
            </Box>
            
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 400 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>District Name</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {districts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No districts found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                districts.map((district) => (
                                    <TableRow key={district.district_id} hover>
                                        <TableCell>{district.district_id}</TableCell>
                                        <TableCell>{district.district_name}</TableCell>
                                        <TableCell>{getStateName(district.stateid)}</TableCell>
                                        <TableCell>{district.status ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpen(district)}><EditIcon /></IconButton>
                                            <IconButton onClick={() => handleDelete(district.district_id)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentDistrict ? 'Edit District' : 'Add District'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="district_name" label="District Name" type="text" fullWidth variant="outlined" value={formData.district_name} onChange={handleChange} sx={{ mb: 2 }}/>
                    <FormControl fullWidth margin="dense" variant="outlined" sx={{ mb: 2 }}>
                        <InputLabel>State</InputLabel>
                        <Select name="stateid" value={formData.stateid} onChange={handleChange} label="State">
                            {states.map(state => (
                                <MenuItem key={state.stateid} value={state.stateid}>
                                    {state.state}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel control={<Checkbox checked={formData.status} onChange={handleChange} name="status" />} label="Active" />
                    <FormControlLabel control={<Checkbox checked={formData.archive} onChange={handleChange} name="archive" />} label="Archive" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default DistrictsPage; 