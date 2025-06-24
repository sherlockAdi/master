import React, { useState, useEffect } from 'react';
import departmentService from '../services/departmentService';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel,
    CircularProgress, Typography, Box, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [formData, setFormData] = useState({
        DeptName: '', Deptid: '', shortname: '', status: true,
        archive: false, showonwebsite: false, aboutdeptt: ''
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            const response = await departmentService.getAllDepartments();
            setDepartments(response.data);
        } catch (error) {
            console.error("Failed to load departments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (department = null) => {
        setCurrentDepartment(department);
        if (department) {
            setFormData({
                DeptName: department.DeptName || '', Deptid: department.Deptid || '',
                shortname: department.shortname || '', status: !!department.status,
                archive: !!department.archive, showonwebsite: !!department.showonwebsite,
                aboutdeptt: department.aboutdeptt || ''
            });
        } else {
            setFormData({
                DeptName: '', Deptid: '', shortname: '', status: true,
                archive: false, showonwebsite: false, aboutdeptt: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDepartment(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        if (currentDepartment) {
            await departmentService.updateDepartment(currentDepartment.id, formData);
        } else {
            await departmentService.createDepartment(formData);
        }
        loadDepartments();
        handleClose();
    };

    const handleDelete = async (id) => {
        await departmentService.deleteDepartment(id);
        loadDepartments();
    };

    return (
        <Paper sx={{ p: 2, margin: 'auto', maxWidth: 1200, flexGrow: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Departments</Typography>
                <Button variant="contained" onClick={() => handleOpen()}>Add Department</Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 400 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Short Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No departments found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                departments.map((department) => (
                                    <TableRow key={department.id} hover>
                                        <TableCell>{department.id}</TableCell>
                                        <TableCell>{department.DeptName}</TableCell>
                                        <TableCell>{department.shortname}</TableCell>
                                        <TableCell>{department.status ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpen(department)}><EditIcon /></IconButton>
                                            <IconButton onClick={() => handleDelete(department.id)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{currentDepartment ? 'Edit Department' : 'Add Department'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="DeptName" label="Department Name" type="text" fullWidth variant="outlined" value={formData.DeptName} onChange={handleChange} sx={{ mb: 2 }}/>
                    <TextField margin="dense" name="shortname" label="Short Name" type="text" fullWidth variant="outlined" value={formData.shortname} onChange={handleChange} sx={{ mb: 2 }}/>
                    <TextField margin="dense" name="aboutdeptt" label="About Department" type="text" fullWidth multiline rows={3} variant="outlined" value={formData.aboutdeptt} onChange={handleChange} sx={{ mb: 2 }}/>
                    <FormControlLabel control={<Checkbox checked={formData.status} onChange={handleChange} name="status" />} label="Active" />
                    <FormControlLabel control={<Checkbox checked={formData.archive} onChange={handleChange} name="archive" />} label="Archive" />
                    <FormControlLabel control={<Checkbox checked={formData.showonwebsite} onChange={handleChange} name="showonwebsite" />} label="Show on Website" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default DepartmentsPage; 