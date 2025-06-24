import React, { useState, useEffect } from 'react';
import designationService from '../services/designationService';
import departmentService from '../services/departmentService';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel,
    Select, MenuItem, FormControl, InputLabel, CircularProgress, Typography, Box, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DesignationsPage = () => {
    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentDesignation, setCurrentDesignation] = useState(null);
    const [formData, setFormData] = useState({
        Desgname: '', shortname: '', departmentid: '', status: true, archive: false, gradeid: ''
    });

    useEffect(() => {
        loadInitialData();
    }, []);
    
    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [desResponse, deptResponse] = await Promise.all([
                designationService.getAllDesignations(),
                departmentService.getAllDepartments()
            ]);
            setDesignations(desResponse.data);
            setDepartments(deptResponse.data);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDesignations = async () => {
        const response = await designationService.getAllDesignations();
        setDesignations(response.data);
    };

    const handleOpen = (designation = null) => {
        setCurrentDesignation(designation);
        if (designation) {
            setFormData({
                Desgname: designation.Desgname || '', shortname: designation.shortname || '',
                departmentid: designation.departmentid || '', status: !!designation.status,
                archive: !!designation.archive, gradeid: designation.gradeid || ''
            });
        } else {
            setFormData({
                Desgname: '', shortname: '', departmentid: '', status: true,
                archive: false, gradeid: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDesignation(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        if (currentDesignation) {
            await designationService.updateDesignation(currentDesignation.id, formData);
        } else {
            await designationService.createDesignation(formData);
        }
        loadDesignations();
        handleClose();
    };

    const handleDelete = async (id) => {
        await designationService.deleteDesignation(id);
        loadDesignations();
    };

    const getDepartmentName = (departmentid) => {
        const department = departments.find(d => d.id === departmentid);
        return department ? department.DeptName : 'N/A';
    }

    return (
        <Paper sx={{ p: 2, margin: 'auto', maxWidth: 1200, flexGrow: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Designations</Typography>
                <Button variant="contained" onClick={() => handleOpen()}>Add Designation</Button>
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
                                <TableCell>Name</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {designations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No designations found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                designations.map((designation) => (
                                    <TableRow key={designation.id} hover>
                                        <TableCell>{designation.id}</TableCell>
                                        <TableCell>{designation.Desgname}</TableCell>
                                        <TableCell>{getDepartmentName(designation.departmentid)}</TableCell>
                                        <TableCell>{designation.status ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpen(designation)}><EditIcon /></IconButton>
                                            <IconButton onClick={() => handleDelete(designation.id)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentDesignation ? 'Edit Designation' : 'Add Designation'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="Desgname" label="Designation Name" type="text" fullWidth variant="outlined" value={formData.Desgname} onChange={handleChange} sx={{ mb: 2 }}/>
                    <FormControl fullWidth margin="dense" variant="outlined" sx={{ mb: 2 }}>
                        <InputLabel>Department</InputLabel>
                        <Select name="departmentid" value={formData.departmentid} onChange={handleChange} label="Department">
                            {departments.map(department => (
                                <MenuItem key={department.id} value={department.id}>
                                    {department.DeptName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField margin="dense" name="shortname" label="Short Name" type="text" fullWidth variant="outlined" value={formData.shortname} onChange={handleChange} sx={{ mb: 2 }}/>
                    <TextField margin="dense" name="gradeid" label="Grade ID" type="text" fullWidth variant="outlined" value={formData.gradeid} onChange={handleChange} sx={{ mb: 2 }}/>
                    <FormControlLabel control={<Checkbox checked={formData.status} onChange={handleChange} name="status" />} label="Active"/>
                    <FormControlLabel control={<Checkbox checked={formData.archive} onChange={handleChange} name="archive" />} label="Archive"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default DesignationsPage; 