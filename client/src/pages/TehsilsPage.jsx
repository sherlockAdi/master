import React, { useState, useEffect } from 'react';
import tehsilService from '../services/tehsilService';
import districtService from '../services/districtService';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel,
    Select, MenuItem, FormControl, InputLabel, CircularProgress, Typography, Box, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TehsilsPage = () => {
    const [tehsils, setTehsils] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentTehsil, setCurrentTehsil] = useState(null);
    const [formData, setFormData] = useState({ tehsil_name: '', district_id: '', status: true, archive: false });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [tehsilResponse, distResponse] = await Promise.all([
                tehsilService.getAllTehsils(),
                districtService.getAllDistricts()
            ]);
            setTehsils(tehsilResponse.data);
            setDistricts(distResponse.data);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const loadTehsils = async () => {
        const response = await tehsilService.getAllTehsils();
        setTehsils(response.data);
    };

    const handleOpen = (tehsil = null) => {
        setCurrentTehsil(tehsil);
        if (tehsil) {
            setFormData({ tehsil_name: tehsil.tehsil_name, district_id: tehsil.district_id, status: !!tehsil.status, archive: !!tehsil.archive });
        } else {
            setFormData({ tehsil_name: '', district_id: '', status: true, archive: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentTehsil(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        if (currentTehsil) {
            await tehsilService.updateTehsil(currentTehsil.tehsil_id, formData);
        } else {
            await tehsilService.createTehsil(formData);
        }
        loadTehsils();
        handleClose();
    };

    const handleDelete = async (id) => {
        await tehsilService.deleteTehsil(id);
        loadTehsils();
    };
    
    const getDistrictName = (district_id) => {
        const district = districts.find(d => d.district_id === district_id);
        return district ? district.district_name : 'N/A';
    }

    return (
        <Paper sx={{ p: 2, margin: 'auto', maxWidth: 1200, flexGrow: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Tehsils</Typography>
                <Button variant="contained" onClick={() => handleOpen()}>Add Tehsil</Button>
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
                                <TableCell>Tehsil Name</TableCell>
                                <TableCell>District</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tehsils.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No tehsils found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tehsils.map((tehsil) => (
                                    <TableRow key={tehsil.tehsil_id} hover>
                                        <TableCell>{tehsil.tehsil_id}</TableCell>
                                        <TableCell>{tehsil.tehsil_name}</TableCell>
                                        <TableCell>{getDistrictName(tehsil.district_id)}</TableCell>
                                        <TableCell>{tehsil.status ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpen(tehsil)}><EditIcon /></IconButton>
                                            <IconButton onClick={() => handleDelete(tehsil.tehsil_id)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentTehsil ? 'Edit Tehsil' : 'Add Tehsil'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="tehsil_name" label="Tehsil Name" type="text" fullWidth variant="outlined" value={formData.tehsil_name} onChange={handleChange} sx={{ mb: 2 }}/>
                    <FormControl fullWidth margin="dense" variant="outlined" sx={{ mb: 2 }}>
                        <InputLabel>District</InputLabel>
                        <Select name="district_id" value={formData.district_id} onChange={handleChange} label="District">
                            {districts.map(district => (
                                <MenuItem key={district.district_id} value={district.district_id}>
                                    {district.district_name}
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

export default TehsilsPage; 