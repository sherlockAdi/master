import React, { useState, useEffect } from 'react';
import countryService from '../services/countryService';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel
} from '@mui/material';

const CountriesPage = () => {
    const [countries, setCountries] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentCountry, setCurrentCountry] = useState(null);
    const [formData, setFormData] = useState({ country: '', status: true, archive: false });

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        const response = await countryService.getAllCountries();
        setCountries(response.data);
    };

    const handleOpen = (country = null) => {
        setCurrentCountry(country);
        if (country) {
            setFormData({ country: country.country, status: country.status, archive: country.archive });
        } else {
            setFormData({ country: '', status: true, archive: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentCountry(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        if (currentCountry) {
            await countryService.updateCountry(currentCountry.conid, formData);
        } else {
            await countryService.createCountry(formData);
        }
        loadCountries();
        handleClose();
    };

    const handleDelete = async (id) => {
        await countryService.deleteCountry(id);
        loadCountries();
    };

    return (
        <div>
            <h2>Countries</h2>
            <Button variant="contained" onClick={() => handleOpen()}>Add Country</Button>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Archive</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {countries.map((country) => (
                            <TableRow key={country.conid}>
                                <TableCell>{country.conid}</TableCell>
                                <TableCell>{country.country}</TableCell>
                                <TableCell>{country.status ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>{country.archive ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(country)}>Edit</Button>
                                    <Button onClick={() => handleDelete(country.conid)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentCountry ? 'Edit Country' : 'Add Country'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="country"
                        label="Country Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.country}
                        onChange={handleChange}
                    />
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

export default CountriesPage; 