import React from "react";
import {InputLabel,Select,MenuItem,FormHelperText, Modal, Card, Typography, TextField, CardContent, Box, FormControl, Button, Skeleton, Grid, IconButton } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { style2 } from '../../Styles';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";


export default function ViewEvent(props) {

    const { confirmEvent, setTextField, setDateField, buttonProp, handleOpen, handleDescription, setOpen, open, handleClose, initExisting,  loadModal, editable } = props;

    if (loadModal === true) {
        return (
            <Modal
                open={open}
                onClose={handleClose}>
                <Card sx={{ ...style2, minWidth: 500, minHeight: 500 }}>
                    <CardContent sx={{ justifyContent: 'center', display: 'flex' }}>
                        <Skeleton variant="rectangular" animation="wave" width={300} height={100} />
                    </CardContent>
                    <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Skeleton variant="rectangular" animation="wave" width={350} height={50} />
                    </CardContent>
                    <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Skeleton variant="rectangular" animation="wave" width={350} height={50} />
                    </CardContent>
                    <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Skeleton variant="rectangular" animation="wave" width={350} height={50} />
                    </CardContent>
                    <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Skeleton variant="rectangular" animation="wave" width={350} height={50} />
                    </CardContent>
                </Card>
            </Modal>)
    }
    else {


        return (
            <Modal
                open={open}
                onClose={handleClose}>
                <Card sx={{ ...style2, minWidth: 500, minHeight: 500 }}>
                    <Grid
                        container
                        rowSpacing={0}
                        columnSpacing={1}
                        direction="row"
                        justifyContent="center"
                        alignItems="center">
                        <Grid item xs={10} textAlign='center'>
                            <Typography variant="h3">
                                View Event
                            </Typography>
                        </Grid>
                        <Grid item xs={1} textAlign="center">
                            <IconButton color={"error"} onClick={handleClose}>
                                <CancelOutlinedIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
                            <Typography variant='h5' >Name: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                disabled
                                id="outlined"
                                defaultValue={initExisting.employee_name}>
                            </TextField>
                        </Grid>

                        <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
                            <Typography variant="h5">Start Date:</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        disabled={!editable}
                                        minDate={new Date() + 1}
                                        inputFormat="dd/MM/yyyy"
                                        label="Start Date"
                                        value={initExisting.start_date}
                                        onChange={() => undefined}
                                        onAccept={(date) => setDateField("start_date", date)}
                                        onClose={(date) => setDateField("start_date", date)}
                                        renderInput={(params) => (
                                            <TextField
                                                onBlur={() => setTextField("start_date")}
                                                {...params}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl  sx={{ mt: 3 }}>
                                <InputLabel>Time</InputLabel>
                                <Select
                                    disabled={!editable}
                                    name="start_time"
                                    size="medium"
                                    value={initExisting.start_time}
                                    onChange={(time) => setDateField("start_time",time)}
                                    // onBlur={handleBlur}
                                >
                                    <MenuItem value={"AM"}>AM</MenuItem>
                                    <MenuItem value={"PM"}>PM</MenuItem>
                                </Select>
                                <FormHelperText>Required</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
                            <Typography variant="h5">End Date:</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        disabled={!editable}
                                        minDate={new Date() + 1}
                                        inputFormat="dd/MM/yyyy"
                                        label="End Date"
                                        value={initExisting.end_date}
                                        onChange={() => undefined}
                                        onAccept={(date) => setDateField("end_date", date)}
                                        onClose={(date) => setDateField("end_date", date)}
                                        renderInput={(params) => (
                                            <TextField
                                                onBlur={() => setTextField("end_date")}
                                                {...params}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </FormControl>

                        </Grid>
                        <Grid item xs={2}>
                            <FormControl  sx={{ mt: 3 }}>
                                <InputLabel>Time</InputLabel>
                                <Select
                                    disabled={!editable}
                                    name="end_time"
                                    size="medium"
                                    value={initExisting.end_time}
                                    onChange={(time) => setDateField("end_time",time)}
                                    // onBlur={handleBlur}
                                >
                                    <MenuItem value={"AM"}>AM</MenuItem>
                                    <MenuItem value={"PM"}>PM</MenuItem>
                                </Select>
                                <FormHelperText>Required</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
                            <Typography variant='h5' >Event Details: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                disabled={!editable}
                                id="outline"
                                value={initExisting.event_details}
                                onChange={(event)=>setDateField("event_details",event.target.value)}>
                            </TextField>
                        </Grid>
                        <Grid container
                            rowSpacing={0}
                            columnSpacing={10}
                            direction="row"
                            justifyContent="center"
                            alignItems="center" mt={5}>
                            <Grid item xs={3}>
                                <Button name={"Delete"} disabled={!editable} variant={'outlined'} color={'error'} onClick={handleOpen} >
                                    Delete
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button name={"Update"} disabled={!editable} variant={'outlined'} color={'primary'} onClick={handleOpen} >
                                    Update
                                </Button>
                            </Grid></Grid>

                    </Grid>

                    <Modal
                        hideBackdrop
                        open={confirmEvent}
                        onClose={handleClose}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                    >
                        <Box sx={{ ...style2, width: 300 }}>
                            <Grid
                                container
                                rowSpacing={4}
                                columnSpacing={2}
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item xs={10} textAlign="center">
                                    <Typography variant="h5">Submit Application?</Typography>
                                </Grid>
                                <Grid item xs={10} textAlign="center">
                                    <Typography variant="h7">
                                        Please ensure all details are filled in correctly.
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button onClick={handleClose} variant={"outlined"}>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        onClick={(event) => buttonProp.buttonClick(initExisting.event_id)}
                                        variant={"outlined"}
                                    >
                                        Confirm
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Modal>
                </Card>
            </Modal >
        )
    }
}