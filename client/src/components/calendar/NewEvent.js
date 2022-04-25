import React, { useState } from "react";
import { InputLabel, FormHelperText, Select, MenuItem, Modal, Card, Typography, TextField, Box, CardContent, FormControl, CardActions, Button, Skeleton, Grid, IconButton } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { style2 } from '../../Styles';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";


export default function NewEvent(props) {

    const { setNewTextField, setNewDateField, handleDescription, confirmEvent, setConfirmEvent, newEvent, handleClose, initItem, loadModal, createEvent, isError } = props;
    if (loadModal === true) {
        return (
            <Modal
                open={newEvent}
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
                open={newEvent}
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
                                New Event
                            </Typography>
                        </Grid>
                        <Grid item xs={1} textAlign="center">
                            <IconButton color={"error"} onClick={handleClose}>
                                <CancelOutlinedIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
                            <Typography variant='h5'  >Name: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                disabled
                                id="outlined"
                                defaultValue={initItem.employee_name}>
                            </TextField>
                        </Grid>
                        <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
                            <Typography variant="h5">Start Date:</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker

                                        minDate={new Date() + 1}
                                        inputFormat="dd/MM/yyyy"
                                        label="Start Date"
                                        value={initItem.start_date}
                                        onChange={() => undefined}
                                        onAccept={(date) => setNewDateField("start_date", date)}
                                        onClose={(date) => setNewDateField("start_date", date)}
                                        renderInput={(params) => (
                                            <TextField
                                                onBlur={() => setNewTextField("start_date")}
                                                {...params}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl sx={{ mt: 3 }}>
                                <InputLabel>Time</InputLabel>
                                <Select

                                    name="start_time"
                                    size="medium"
                                    value={initItem.start_time}
                                    onChange={(time) => setNewDateField("start_time", time.target.value)}
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

                                        minDate={new Date() + 1}
                                        inputFormat="dd/MM/yyyy"
                                        label="End Date"
                                        value={initItem.end_date}
                                        onChange={() => undefined}
                                        onAccept={(date) => setNewDateField("end_date", date)}
                                        onClose={(date) => setNewDateField("end_date", date)}
                                        renderInput={(params) => (
                                            <TextField
                                                onBlur={() => setNewTextField("end_date")}
                                                {...params}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl sx={{ mt: 3 }}>
                                <InputLabel>Time</InputLabel>
                                <Select

                                    name="end_time"
                                    size="medium"
                                    value={initItem.end_time}
                                    onChange={(time) => setNewDateField("end_time", time.target.value)}
                                // onBlur={handleBlur}
                                >
                                    <MenuItem value={"AM"}>AM</MenuItem>
                                    <MenuItem value={"PM"}>PM</MenuItem>
                                </Select>
                                <FormHelperText>Required</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
                            <Typography variant="h5"> Event Details: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Details" variant="outlined" onChange={handleDescription} error={isError} />
                            {isError ? <Typography color={'red'} >Please enter required fields</Typography> : null}
                        </Grid>
                        <Grid item xs={3}>
                            <Button onClick={handleClose} variant={'outlined'} >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button onClick={() => setConfirmEvent(true)} variant={'outlined'}>
                                Submit
                            </Button>
                        </Grid>
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
                                        onClick={createEvent}
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