import React, { useState, useEffect } from "react";
import { Typography, Grid, TextField, Skeleton, Avatar, Box, Paper, Container, InputAdornment, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from "@mui/material/IconButton";
import axios from 'axios';
import { tableBox, tableHeader, tableStyle, profileStyle } from '../../Styles';

const loginID = localStorage.getItem("employeeId");

export default function ProfilePage() {

    const [edit, setEdit] = useState(false);
    const [cancel, setCancelEdit] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [num, setNum] = useState('');
    const [oldNum, setOldNum] = useState('');
    const [error, setError] = useState(false);
    const [onLoad, setOnLoad] = useState(false);
    const [employeeObj, setEmployeeObj] = useState({
        employee_number: '',
        employee_email: '',
        employee_department: '',
        employee_position: '',

    });
    const [buttonState, setButtonState] = useState({});

    const initProfile = (employeeObj) => {
        console.log(employeeObj);
        setEmployeeObj(employeeObj);
        setNum(employeeObj.employee_number);
    }



    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setNum(value);
        if (e.target.value === "") {
            setError(true);
        }
        else {
            setError(false);
        }
    }

    const isEdit = () => {
        setEdit(true);
        setOldNum(num);
    }

    const handleCancel = () => {
        setCancelEdit(!cancel);
        setEdit(!edit);
        setNum(oldNum);
    }

    const handleSave = () => {
        setConfirm(!confirm);
        setEdit(!edit);
    }
    const buttonObj = () => {
        if (!edit) {
            return (
                < InputAdornment position="end" >
                    <Tooltip title={"Click to edit"} followCursor>
                        <IconButton color="info" onClick={isEdit}><EditIcon /></IconButton >
                    </Tooltip>
                </InputAdornment >


            )
        }
        else {
            return (
                <div>
                    <Tooltip title={"Confirm update"} followCursor>
                        <IconButton color="success" onClick={handleSave}
                            disabled={error}
                        ><CheckCircleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Cancel update"} followCursor>
                        <IconButton color="error" onClick={handleCancel}
                            disabled={error}
                        ><CancelIcon /></IconButton>
                    </Tooltip>
                </div>
            )
        }
    }

    const getUserProfile = async () => {
        setOnLoad(true);
        try {

            const res = await axios.get("/getProfile",
                {
                    params: { employeeId: loginID }
                }).then((response) => {

                    initProfile(response.data[0]);
                });
            setOnLoad(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(async () => {
        getUserProfile();

    }, []);

    if (onLoad && loginID === '1') {
        return (
            <Container>
                <Box sx={tableBox}>
                    <Typography sx={tableHeader} variant={"h2"}>
                        Profile
                    </Typography>
                    <Paper sx={profileStyle}>
                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={1}
                            direction="row"
                            justifyContent="center"
                            alignItems="center">
                            <Grid item>
                                <Skeleton variant="circular" animation="wave" width={200} height={200} />
                            </Grid>
                            <Grid item  >
                                <Skeleton variant="rectangular" animation="wave" width={200} height={30} />
                            </Grid>
                            <Grid item  >
                                <Skeleton variant="rectangular" animation="wave" width={200} height={30} />
                            </Grid>
                            <Grid item  >
                                <Skeleton variant="rectangular" animation="wave" width={350} height={50} />
                            </Grid>
                            <Grid item  >
                                <Skeleton variant="rectangular" animation="wave" width={350} height={50} />
                            </Grid>

                            <Grid item >
                                <Skeleton variant="rectangular" animation="wave" width={350} height={50} />

                            </Grid>
                            <Grid item >
                                <Skeleton variant="rectangular" animation="wave" width={350} height={50} />
                            </Grid>


                        </Grid>
                    </Paper>
                </Box >
            </Container >
        )
    }
    else {

        return (
            <Container>
                <Box sx={tableBox}>
                    <Typography sx={tableHeader} variant={"h2"}>
                        Profile
                    </Typography>
                    <Paper sx={profileStyle}>
                        <Grid
                            container
                            rowSpacing={0}
                            columnSpacing={1}
                            direction="row"
                            justifyContent="center"
                            alignItems="center">
                            <Grid item xs={6}>
                                <Avatar src={`http://localhost:5000/profile/${employeeObj.employee_name}.jpg`} sx={{ width: 200, height: 200 }}></Avatar>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='h4' textAlign='center'>{employeeObj.employee_name}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='h6' textAlign='center'>EMPLOYEE ID: {employeeObj.employee_id}</Typography>
                            </Grid>

                            <Grid item xs={4}>
                                <Typography variant='h6' >Mobile No.:</Typography>
                            </Grid>
                            <Grid item xs={6}>

                                {error === false ?

                                    <TextField

                                        disabled={!edit}
                                        id="outlined"
                                        value={num}
                                        inputProps={{ maxLength: 8 }}
                                        onChange={e => handleChange(e)}
                                        InputProps={{
                                            endAdornment: buttonObj()
                                        }}
                                    ></TextField>
                                    :

                                    <TextField
                                        error
                                        value={num}
                                        inputProps={{ maxLength: 8 }}
                                        id="outlined-error"
                                        helperText="*Required"
                                        onChange={e => handleChange(e)}
                                        InputProps={{
                                            endAdornment: buttonObj()
                                        }} />

                                }
                            </Grid>

                            <Grid item xs={4} >
                                <Typography variant='h6'  >Email Address</Typography>
                            </Grid>
                            <Tooltip title={"Cannot be edited"} followCursor>
                                <Grid item xs={6}  >

                                    <TextField
                                        disabled
                                        id="outline-disabled"
                                        value={employeeObj.employee_email}
                                        defaultValue={employeeObj.employee_email}>
                                    </TextField>
                                </Grid>
                            </Tooltip>

                            <Grid item xs={4} >
                                <Typography variant='h6'  >Department</Typography>
                            </Grid>
                            <Tooltip title={"Cannot be edited"} followCursor>
                                <Grid item xs={6} >

                                    <TextField
                                        disabled
                                        id="outline-disabled"
                                        value={employeeObj.employee_department}
                                        defaultValue={employeeObj.employee_department}>
                                    </TextField>
                                </Grid>
                            </Tooltip>

                            <Grid item xs={4} >
                                <Typography variant='h6'  >Position</Typography>
                            </Grid>
                            <Tooltip title={"Cannot be edited"} followCursor>
                                <Grid item xs={6} >

                                    <TextField
                                        disabled
                                        id="outline-disabled"
                                        value={employeeObj.employee_position}
                                    >
                                    </TextField>
                                </Grid>
                            </Tooltip>

                        </Grid>
                    </Paper>
                </Box>
            </Container >
        );
    }
}