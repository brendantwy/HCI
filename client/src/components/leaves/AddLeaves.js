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
  FormHelperText,
  IconButton,
  Tooltip
} from "@mui/material";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import axios from "axios";
import Modal from "@mui/material/Modal";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FileUpload from "../common/FileUpload";
import moment from "moment";

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
const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function validateFields(
  leaves_type,
  leaves_start_date,
  leaves_end_date,
  leaves_start_time,
  leaves_end_time,
  leaves_approver_name
) {
  return {
    leaves_type: leaves_type === "",
    leaves_start_date: leaves_start_date === null,
    leaves_end_date: leaves_end_date === null,
    leaves_start_time: leaves_start_time === "",
    leaves_end_time: leaves_end_time === "",
    leaves_approver_name: leaves_approver_name === "",
  };
}

const loginID = localStorage.getItem("employeeId");
export default function AddLeaves(props) {
  const { retrieveLeavesData, handleSnackbar, quotaData } = props;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [localRowData, setLocalRowData] = useState({
    leaves_type: "",
    leaves_start_date: null,
    leaves_end_date: null,
    leaves_start_time: "",
    leaves_end_time: "",
    leaves_approver_name: "",
    leaves_remarks: "",
    leaves_file: null,
    leaves_status: "PENDING",
  });

  const [fieldTouched, setFieldTouched] = useState({
    leaves_type: false,
    leaves_start_date: true,
    leaves_end_date: false,
    leaves_start_time: false,
    leaves_end_time: false,
    leaves_approver_name: false,
  });

  const [open, setOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const newLeaves = async () => {
    try {
      console.log(localRowData);
      await axios
        .post(
          "/addLeaves",
          {
            rowData: localRowData,
            employeeId: loginID,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          console.log("response" + response);
        });
      handleClose();
      handleCloseConfirm();
      retrieveLeavesData();
      handleSnackbar("Leaves Added Successfully!", "success");
    } catch (err) {
      console.log(err);
      handleSnackbar("Error!", "error");
    }
  };

  const setField = (event) => {
    setLocalRowData({
      ...localRowData,
      [event.target.name]: [event.target.value],
    });
  };

  const setDateField = (name, date) => {
    if (date === undefined) {
      return;
    }
    setLocalRowData({
      ...localRowData,
      [name]: [date],
    });
  };

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
    localRowData.leaves_end_date,
    localRowData.leaves_start_time,
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
    var startYear = localRowData.leaves_start_date[0].getFullYear();
    var startMonth = localRowData.leaves_start_date[0].getMonth();
    var startDay = localRowData.leaves_start_date[0].getDate();

    var endYear = localRowData.leaves_end_date[0].getFullYear();
    var endMonth = localRowData.leaves_end_date[0].getMonth();
    var endDay = localRowData.leaves_end_date[0].getDate();

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
        localRowData.leaves_start_time[0] === "PM" &&
        localRowData.leaves_end_time[0] === "AM"
      ) {
        return true;
      }
    } else {
      return false;
    }
  };

  const quotaCheck = () => {
    var timeDiff = Math.abs(
      localRowData.leaves_end_date[0] - localRowData.leaves_start_date[0]
    );
    var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) {
      daysDiff = 1;
    }
    switch (localRowData.leaves_type[0]) {
      case "Annual Leave":
        if (quotaData.annual < daysDiff) {
          return true;
        } else {
          return false;
        }
      case "Medical":
        if (quotaData.medical < daysDiff) {
          return true;
        } else {
          return false;
        }
      case "Childcare":
        if (quotaData.childcare < daysDiff) {
          return true;
        } else {
          return false;
        }
      case "Parental":
        if (quotaData.parental < daysDiff) {
          return true;
        } else {
          return false;
        }
    }
  };
  const textToDate = (event) => {
    const date = new Date(event.target.value);
    setDateField("leaves_start_date", date);
  };

  const handleSubmit = () => {
    if (dateCheck()) {
      alert("start cannot be before end");
    } else if (quotaCheck()) {
      alert(`Not enough ${localRowData.leaves_type[0]} days`);
    } else {
      handleOpenConfirm();
    }
  };
  return (
    <React.Fragment>
      <Tooltip title={"Click to add leaves"} followCursor>
        <Button variant={"outlined"} onClick={handleOpen}>
          Apply for Leave
        </Button>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
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
              <Typography variant="h4">Apply for Leave</Typography>
            </Grid>
            <Grid item xs={1} textAlign="center">
              <IconButton color={"error"} onClick={handleClose}>
                <CancelOutlinedIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 4 }}>
              <Typography>Leave type:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                error={markRed("leaves_type")}
                sx={{ minWidth: 200, mt: 2 }}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  name="leaves_type"
                  size="small"
                  sx={{ mt: 1 }}
                  value={localRowData.leaves_type}
                  onChange={setField}
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
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    minDate={today}
                    inputFormat="dd/MM/yyyy"
                    label="dd/mm/yyyy"
                    value={localRowData.leaves_start_date}
                    onChange={() => undefined}
                    onAccept={(date) => setDateField("leaves_start_date", date)}
                    onClose={(date) => setDateField("leaves_start_date", date)}
                    renderInput={(params) => (
                      <TextField
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
                  name="leaves_start_time"
                  size="medium"
                  value={localRowData.leaves_start_time}
                  onChange={setField}
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
                    minDate={today}
                    inputFormat="dd/MM/yyyy"
                    label="End Date"
                    value={localRowData.leaves_end_date}
                    onChange={() => undefined}
                    onAccept={(date) => setDateField("leaves_end_date", date)}
                    onClose={(date) => setDateField("leaves_end_date", date)}
                    renderInput={(params) => (
                      <TextField
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
                  name="leaves_end_time"
                  size="medium"
                  value={localRowData.leaves_end_time}
                  onChange={setField}
                  onBlur={handleBlur}
                >
                  <MenuItem value={"AM"}>AM</MenuItem>
                  <MenuItem value={"PM"}>PM</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Approver:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                error={markRed("leaves_approver_name")}
                sx={{ minWidth: 200, mt: 2 }}
              >
                <InputLabel>Superior</InputLabel>
                <Select
                  name="leaves_approver_name"
                  size="small"
                  sx={{ mt: 1 }}
                  value={localRowData.leaves_approver_name}
                  onChange={setField}
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
                defaultValue={""}
                name="leaves_remarks"
                size="small"
                label="Remarks"
                variant="outlined"
                sx={{ mt: 2 }}
                onChange={setField}
              />
              <FormHelperText>Optional</FormHelperText>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Upload File:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FileUpload
                type={"leaves"}
                disabled={false}
                file_info={localRowData.leaves_file}
                setLocalRowData={setLocalRowData}
                localRowData={localRowData}
              />
            </Grid>
            <Grid item xs={4} sx={{ ml: 9 }}>
              <Button
                variant={"outlined"}
                color={"primary"}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Grid>
            <React.Fragment>
              <Grid item xs={3}>
                <Button
                  disabled={isDisabled}
                  variant={"outlined"}
                  color={"primary"}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Grid>
              <Modal
                hideBackdrop
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="confirm-modal"
                aria-describedby="confirm-modal-desc"
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
                        Please ensure all details are filled in correctly
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Button onClick={handleCloseConfirm} variant={"outlined"}>
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button onClick={newLeaves} variant={"outlined"}>
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
    </React.Fragment>
  );
}
