import React, { useEffect, useState } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Skeleton,
  FormHelperText,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import axios from "axios";
import Modal from "@mui/material/Modal";
import FileUpload from "../common/FileUpload";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import { style2 } from "../../Styles";
const loginID = localStorage.getItem("employeeId");
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function validateFields(
  type,
  startDate,
  endDate,
  startTime,
  endTime,
  approver
) {
  return {
    type: type === "",
    startDate: startDate === null,
    endDate: endDate === null,
    startTime: startTime === "",
    endTime: endTime === "",
    approver: approver === "",
  };
}

export default function ViewLeaves(props) {
  const {
    handleSnackbar,
    rowData,
    openViewLeaves,
    setOpenViewLeaves,
    retrieveLeavesData,
    quotaData,
  } = props;
  const [open, setOpen] = useState(false);
  const [onLoad, setOnLoad] = useState(false);
  const [localRowData, setLocalRowData] = useState({});
  const [oldRowData, setOldRowData] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [buttonProp, setButtonProp] = useState({});
  const [fieldTouched, setFieldTouched] = React.useState({
    leaves_type: false,
    leaves_start_date: true,
    leaves_end_date: false,
    leaves_start_time: false,
    leaves_end_time: false,
    leaves_approver_name: false,
  });

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);


  const setFields = (event) => {
    setLocalRowData({
      ...localRowData,
      [event.target.name]: event.target.value,
    });
  };

  const setDateField = (name, date) => {
    console.log(date);
    if (date === undefined) {
      return;
    }
    setLocalRowData({
      ...localRowData,
      [name]: new Date(date),
    });
  };

  const quotaCheck = () => {
    var oldStartDate = oldRowData.leaves_start_date;
    var oldEndDate = oldRowData.leaves_end_date;

    if (typeof startDate && typeof endDate === "string") {
      startDate = new Date(oldRowData.leaves_start_date);
      endDate = new Date(oldRowData.leaves_end_date);
    } else if (typeof startDate === "string") {
      startDate = new Date(oldRowData.leaves_start_date);
    } else if (typeof endDate === "string") {
      endDate = new Date(oldRowData.leaves_end_date);
    }
    var oldTimeDiff = Math.abs(oldEndDate - oldStartDate);
    var oldDaysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (oldDaysDiff === 0) {
      oldDaysDiff = 1;
    }

    var startDate = localRowData.leaves_start_date;
    var endDate = localRowData.leaves_end_date;

    if (typeof startDate && typeof endDate === "string") {
      startDate = new Date(localRowData.leaves_start_date);
      endDate = new Date(localRowData.leaves_end_date);
    } else if (typeof startDate === "string") {
      startDate = new Date(localRowData.leaves_start_date);
    } else if (typeof endDate === "string") {
      endDate = new Date(localRowData.leaves_end_date);
    }
    var timeDiff = Math.abs(endDate - startDate);
    var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) {
      daysDiff = 1;
    }

    switch (localRowData.leaves_type) {
      case "Annual Leave":
        console.log(quotaData.annual);
        if (quotaData.annual + oldDaysDiff < daysDiff) {
          return true;
        } else {
          return false;
        }
      case "Medical":
        if (quotaData.medical + oldDaysDiff < daysDiff) {
          return true;
        } else {
          return false;
        }
      case "Childcare":
        if (quotaData.childcare + oldDaysDiff < daysDiff) {
          return true;
        } else {
          return false;
        }
      case "Parental":
        if (quotaData.parental + oldDaysDiff < daysDiff) {
          return true;
        } else {
          return false;
        }
    }
  };
  const handleOpen = (event) => {
    if (event.target.name === "Delete") {
      setButtonProp({
        buttontext: "Delete",
        buttonColor: "error",
        buttonClick: deleteLeaves,
      });
    } else {
      setButtonProp({
        buttonText: "Update",
        buttonColor: "primary",
        buttonClick: updateLeaves,
      });
    }
    if (dateCheck()) {
      alert("start cannot be before end");
    } else if (quotaCheck()) {
      alert(`Not enough ${localRowData.leaves_type} days`);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseViewLeaves = () => {
    setOpenViewLeaves(false);
  };

  const updateLeaves = async () => {
    if (dateCheck()) {
      alert("start cannot be before end");
    }
    try {
      await axios
        .post(
          "/editLeaves",
          {
            rowData: localRowData,
          },
          { headers: { "Content-Type": "application/json " } }
        )
        .then((response) => {
          console.log("response" + response);
        });
      handleClose();
      handleCloseViewLeaves();
      retrieveLeavesData();
      handleSnackbar("Leaves Updated Successfully!", "success");
    } catch (err) {
      console.log(err);
      handleSnackbar("Error!", "error");
    }
  };

  const deleteLeaves = async () => {
    try {
      await axios
        .post(
          "/deleteLeaves",
          {
            rowData: localRowData,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          console.log("response" + response);
        });
      handleClose();
      handleCloseViewLeaves();
      retrieveLeavesData();
      handleSnackbar("Leaves Deleted Successfully!", "success");
    } catch (err) {
      console.log(err);
      handleSnackbar("Error!", "error");
    }
  };

  const loadPage = async () => {
    console.log('onload!')
    setOnLoad(true);
    try {
      await axios.get("/loadPage")
        .then((response) => {
          console.log("response" + response);
        });
      console.log('loading done!');
      setOnLoad(false);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (
      rowData.leaves_status === "APPROVED" ||
      rowData.leaves_status === "REJECTED"
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    setLocalRowData(rowData);
    setOldRowData(rowData);
  }, [rowData]);

  const setTextField = (name) => {
    if (name === "leaves_start_date") {
      if (localRowData.leaves_start_date === null) {
        setLocalRowData({
          ...localRowData,
          [name]: " ",
        });
      }
    } else {
      if (localRowData.leaves_end_date === null) {
        setLocalRowData({
          ...localRowData,
          [name]: " ",
        });
      }
    }
  };
  const handleBlur = (event) => {
    setFieldTouched({
      ...fieldTouched,
      [event.target.name]: true,
    });
  };

  const errors = validateFields(
    localRowData.leaves_type,
    localRowData.leaves_start_date,
    localRowData.leaves_start_time,
    localRowData.leaves_end_date,
    localRowData.leaves_end_time,
    localRowData.leaves_approver_name
  );

  const isDisabled = Object.keys(errors).some((x) => errors[x]);

  const markRed = (field) => {
    const hasError = errors[field];
    const beenTouched = fieldTouched[field];

    return hasError ? beenTouched : false;
  };

  const dateCheck = () => {
    var startDate = localRowData.leaves_start_date;
    var endDate = localRowData.leaves_end_date;

    if (typeof startDate && typeof endDate === "string") {
      startDate = new Date(localRowData.leaves_start_date);
      endDate = new Date(localRowData.leaves_end_date);
    } else if (typeof startDate === "string") {
      startDate = new Date(localRowData.leaves_start_date);
    } else if (typeof endDate === "string") {
      endDate = new Date(localRowData.leaves_end_date);
    }

    var startYear = startDate.getFullYear();
    var startMonth = startDate.getMonth();
    var startDay = startDate.getDate();

    var endYear = endDate.getFullYear();
    var endMonth = endDate.getMonth();
    var endDay = endDate.getDate();

    if (startYear > endYear) {
      return true;
    } else if (startMonth > endMonth && startYear === endYear) {
      return true;
    } else if (
      startDay > endDay &&
      startMonth === endMonth &&
      startYear === endYear
    ) {
      return true;
    } else if (
      startDay === endDay &&
      startMonth === endMonth &&
      startYear === endYear
    ) {
      if (
        localRowData.leaves_start_time === "PM" &&
        localRowData.leaves_end_time === "AM"
      ) {
        return true;
      }
    } else {
      return false;
    }
  };

  const textToDate = (event) => {
    const date = new Date(event.target.value);

    setDateField([event.target.name], moment(date).format("DD/MM/YYYY"));
  };

  if (onLoad === true && loginID === '1') {
    return (<Modal
      open={openViewLeaves}
      onClose={handleCloseViewLeaves}
      aria-labelledby="form-modal-leaves"
      aria-describedby="form-modal-apply-leaves"
    >
      <Card sx={{ ...style, width: 500, height: 600, gap: 2 }}>
        <Grid
          container
          rowSpacing={0}
          columnSpacing={1}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={6} textAlign="center">
            <Skeleton variant="rectangular" animation="wave" width={200} height={50} />
          </Grid>
          <Grid item xs={8} sx={{ ml: 5, mb: 2, mt: 4 }}>
            <Skeleton variant="rectangular" animation="wave" width={300} height={40} />
          </Grid>
          <Grid item xs={8} sx={{ ml: 5, mb: 2, mt: 4 }} >
            <Skeleton variant="rectangular" animation="wave" width={350} height={40} />
          </Grid>
          <Grid item xs={8} sx={{ ml: 5, mb: 2, mt: 4 }}>
            <Skeleton variant="rectangular" animation="wave" width={350} height={40} />
          </Grid>
          <Grid item xs={8} sx={{ ml: 5, mb: 2, mt: 4 }}>
            <Skeleton variant="rectangular" animation="wave" width={300} height={40} />
          </Grid>
          <Grid item xs={8} sx={{ ml: 5, mb: 2, mt: 4 }}>
            <Skeleton variant="rectangular" animation="wave" width={300} height={40} />
          </Grid>
          <Grid item xs={8} sx={{ ml: 5, mb: 2, mt: 2 }}>
            <Skeleton variant="rectangular" animation="wave" width={200} height={40} />
          </Grid>
          <Grid item xs={4} sx={{ ml: 5, mb: 2, }}>
            <Skeleton variant="rectangular" animation="wave" width={100} height={40} />
          </Grid>
          <Grid item xs={4} sx={{ ml: 5, mb: 2, }}>
            <Skeleton variant="rectangular" animation="wave" width={100} height={40} />
          </Grid>
        </Grid>
      </Card>
    </Modal>
    )
  }
  else {
    return (
      <Modal
        open={openViewLeaves}
        onClose={handleCloseViewLeaves}
        aria-labelledby="form-modal-leaves"
        aria-describedby="form-modal-apply-leaves"
      >
        <Card sx={{ ...style, width: 500, height: 600, gap: 2 }}>
          <Grid
            container
            rowSpacing={0}
            columnSpacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={10} textAlign="center">
              <Typography variant="h4">View Leaves</Typography>
            </Grid>
            <Grid item xs={1} textAlign="center">
              <IconButton color={"error"} onClick={handleCloseViewLeaves}>
                <CancelOutlinedIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 4 }}>
              <Typography>Leave type:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl error={markRed("leaves_type")} sx={{ mt: 3 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  disabled={disabled}
                  name="leaves_type"
                  size="small"
                  sx={{ mt: 1 }}
                  value={localRowData.leaves_type}
                  onChange={setFields}
                  onBlur={handleBlur}
                >
                  <MenuItem value={"Annual Leave"}>Annual Leave</MenuItem>
                  <MenuItem value={"Medical"}>Medical</MenuItem>
                  <MenuItem value={"Childcare"}>Childcare</MenuItem>
                  <MenuItem value={"Parental"}>Parental</MenuItem>
                </Select>
              </FormControl>
            </Grid>



            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Start Date:</Typography>
            </Grid>
            <Grid item xs={4}>
            <FormControl error={markRed("leaves_start_date")}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disabled={disabled}
                    minDate={today}
                    inputFormat="dd/MM/yyyy"
                    label="dd/mm/yyyy"
                    value={localRowData.leaves_start_date}
                    onChange={() => undefined}
                    onAccept={(date) => setDateField("leaves_start_date", date)}
                    onClose={(date) => setDateField("leaves_start_date", date)}
                    renderInput={(params) => (
                      <TextField
                        inputFormat="dd/MM/yyyy"
                        name="leaves_start_date"
                        onChange={textToDate}
                        onBlur={() => setTextField("leaves_start_date")}
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl error={markRed("leaves_start_time")} sx={{ mt: 3 }}>
                <InputLabel>Time</InputLabel>
                <Select
                  disabled={disabled}
                  name="leaves_start_time"
                  size="medium"
                  value={localRowData.leaves_start_time}
                  onChange={setFields}
                  onBlur={handleBlur}
                >
                  <MenuItem value={"AM"}>AM</MenuItem>
                  <MenuItem value={"PM"}>PM</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>End Date:</Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl error={markRed("leaves_end_date")}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disabled={disabled}
                    minDate={today}
                    inputFormat="dd/MM/yyyy"
                    label="dd/mm/yyyy"
                    value={localRowData.leaves_end_date}
                    onChange={() => undefined}
                    onAccept={(date) => setDateField("leaves_end_date", date)}
                    onClose={(date) => setDateField("leaves_end_date", date)}
                    renderInput={(params) => (
                      <TextField
                        name="leaves_end_date"
                        onChange={textToDate}
                        onBlur={() => setTextField("leaves_end_date")}
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl error={markRed("leaves_end_time")} sx={{ mt: 3 }}>
                <InputLabel>Time</InputLabel>
                <Select
                  disabled={disabled}
                  name="leaves_end_time"
                  size="medium"
                  labelId="leaves_end_time"
                  id="leaves_end_time"
                  value={localRowData.leaves_end_time}
                  onChange={setFields}
                  onBlur={handleBlur}
                >
                  <MenuItem value={"AM"}>AM</MenuItem>
                  <MenuItem value={"PM"}>PM</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Approved by:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                error={markRed("leaves_approver_name")}
                sx={{ minWidth: 200, mt: 2 }}
              >
                <InputLabel>Superior</InputLabel>
                <Select
                  disabled={disabled}
                  name="leaves_approver_name"
                  size="small"
                  sx={{ mt: 1 }}
                  labelId="leaves_approver_name"
                  id="leaves_approver_name"
                  value={localRowData.leaves_approver_name}
                  label="None"
                  onChange={setFields}
                  onBlur={handleBlur}
                >
                  <MenuItem value={"Daniel"}>Daniel</MenuItem>
                  <MenuItem value={"Adam"}>Adam</MenuItem>
                  <MenuItem value={"Betty"}>Betty</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Remarks:</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                multiline
                disabled={disabled}
                name="leaves_remarks"
                size="small"
                id="remarks"
                label="Remarks"
                variant="outlined"
                value={localRowData.leaves_remarks}
                sx={{ mt: 2 }}
                onChange={setFields}
              />
              <FormHelperText>Optional</FormHelperText>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Upload File:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FileUpload
                type={"leaves"}
                disabled={disabled}
                file_info={localRowData.leaves_file}
                setLocalRowData={setLocalRowData}
                localRowData={localRowData}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                name={"Delete"}
                disabled={disabled}
                color={"error"}
                onClick={handleOpen}
                variant={"outlined"}
              >
                Delete
              </Button>
            </Grid>


            <Grid item xs={3}>
              <Button
                name={"Update"}
                disabled={disabled}
                color={"primary"}
                onClick={handleOpen}
                variant={"outlined"}
              >
                Update
              </Button>
            </Grid>
            <React.Fragment>
              <Modal
                hideBackdrop
                open={open}
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
                        onClick={buttonProp.buttonClick}
                        variant={"outlined"}
                      >
                        Confirm
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>
            </React.Fragment>
          </Grid>
        </Card>
      </Modal>
    );
  }
}
