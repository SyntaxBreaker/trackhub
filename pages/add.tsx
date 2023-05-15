import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Box, TextField, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import getCurrentDate from '../utils/date';
import dayjs from "dayjs";

export default function Add() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        deadline: ''
    })

    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user) window.location.href = '/api/auth/login';
    }, [user, isLoading]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <Box component="form" sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
            <Typography variant="h6" component="h2">Create a new task</Typography>
            <TextField id="name" name="name" label="Name" variant="outlined" sx={{ width: '350px' }} value={formData.name} onChange={handleChange} />
            <TextField id="description" name="description" label="Description" variant="outlined" multiline={true} sx={{ width: '350px' }} value={formData.description} onChange={handleChange} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar minDate={getCurrentDate()} onChange={(newValue) => setFormData(prevData => ({
                    ...prevData,
                    deadline: dayjs(newValue).format().split('T').slice(0, 1).join("-")
                }))} />
            </LocalizationProvider>
        </Box>
    )
}