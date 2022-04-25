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
  Modal,
  TextField,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  FormHelperText,Tooltip
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DatePicker from "@mui/lab/DatePicker";
import axios from "axios";
import FileUpload from "../common/FileUpload";

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
  claims_type,
  claims_amount,
  claims_date,
  claims_approver_name
) {
  return {
    claims_type: claims_type === "",
    claims_amount: claims_amount === "a",
    claims_date: claims_date === null,
    claims_approver_name: claims_approver_name === "",
  };
}

export default function AddClaims(props) {
  const { retrieveClaimsData, handleSnackbar, quotaData } = props;
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [localRowData, setLocalRowData] = useState({
    claims_type: "",
    claims_amount: "",
    claims_date: null,
    claims_approver_name: "",
    claims_remark: "",
    claims_file: null,
    claims_last_updated: null,
    claims_status: "PENDING",
  });

  const [fieldTouched, setFieldTouched] = useState({
    claims_type: false,
    claims_amount: false,
    claims_date: false,
    claims_approver_name: false,
  });

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
  const newClaims = async () => {
    try {
      const res = await axios
        .post(
          "/addClaims",
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
      retrieveClaimsData();
      handleSnackbar("Claims Added Successfully!", "success");
    } catch (err) {
      console.log(err);
    }
  };

  const setField = (event) => {
    setLocalRowData({
      ...localRowData,
      [event.target.name]: event.target.value,
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
    if (name === "claims_date") {
      setLocalRowData({
        ...localRowData,
        [name]: " ",
      });
    }
  };

  const handleBlur = (event) => {
    setFieldTouched({
      ...fieldTouched,
      [event.target.name]: true,
    });
  };

  const errors = validateFields(
    localRowData.claims_type,
    localRowData.claims_amount,
    localRowData.claims_date,
    localRowData.claims_approver_name
  );

  const isDisabled = Object.keys(errors).some((x) => errors[x]);

  const markRed = (field) => {
    const hasError = errors[field];
    const beenTouched = fieldTouched[field];
    return hasError ? beenTouched : false;
  };

  const textToDate = (event) => {
    const date = new Date(event.target.value);
    setDateField("leaves_start_date", date);
  };

  const quotaCheck = () => {
    switch (localRowData.claims_type) {
      case "Dental":
        if (quotaData.dental < localRowData.claims_amount) {
          return true;
        } else {
          return false;
        }
      case "Transport":
        if (quotaData.transport < localRowData.claims_amount) {
          return true;
        } else {
          return false;
        }
      case "Medical":
        if (quotaData.medical < localRowData.claims_amount) {
          return true;
        } else {
          return false;
        }
    }
  };
  const handleSubmit = () => {
    if (quotaCheck()) {
      alert(`Not enough ${localRowData.claims_type} quota!`);
    } else {
      handleOpenConfirm();
    }
  };
  return (
    <React.Fragment>
       <Tooltip title={"Click to add claims"} followCursor>
      <Button variant={"outlined"} onClick={handleOpen}>
        Apply for Claims
      </Button>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Card sx={{ ...style, minWidth: 500, minHeight: 600, gap: 2 }}>
          <Grid
            container
            rowSpacing={0}
            columnSpacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={10} textAlign="center">
              <Typography variant="h4">Apply for Claim</Typography>
            </Grid>
            <Grid item xs={1} textAlign="center">
              <IconButton color={"error"} onClick={handleClose}>
                <CancelOutlinedIcon />
              </IconButton>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 4 }}>
              <Typography>Claim Type:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                error={markRed("claims_type")}
                sx={{ minWidth: 200, mt: 2 }}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  displayEmpty
                  name="claims_type"
                  size="small"
                  sx={{ mt: 1 }}
                  value={localRowData.claims_type}
                  onChange={setField}
                  onBlur={handleBlur}
                >
                  <MenuItem value={"Medical"}>Medical</MenuItem>
                  <MenuItem value={"Transport"}>Transport</MenuItem>
                  <MenuItem value={"Dental"}>Dental</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Claim Amount:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <TextField
                  error={markRed("claims_amount")}
                  label="SGD"
                  size="small"
                  name="claims_amount"
                  variant="outlined"
                  value={localRowData.claims_amount}
                  onChange={setField}
                  onBlur={handleBlur}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Claims Date:</Typography>
            </Grid>
            <Grid item xs={4} sx={{ mr: 10, mt: 2 }}>
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    inputFormat="dd/MM/yyyy"
                    label="Claims Date"
                    value={localRowData.claims_date}
                    onChange={() => undefined}
                    onAccept={(date) => setDateField("claims_date", date)}
                    onClose={(date) => setDateField("claims_date", date)}
                    renderInput={(params) => (
                      <TextField
                        onChange={textToDate}
                        onBlur={() => setTextField("claims_date")}
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Approver: </Typography>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                error={markRed("claims_approver_name")}
                sx={{ minWidth: 200, mt: 2 }}
              >
                <InputLabel>Superior</InputLabel>
                <Select
                  name="claims_approver_name"
                  size="small"
                  sx={{ mt: 1 }}
                  value={localRowData.claims_approver_name}
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
                name="claims_remark"
                size="small"
                label="Remarks"
                sx={{ mt: 2 }}
                variant="outlined"
                onChange={setField}
                value={localRowData.claims_remark}
              />
              <FormHelperText>Optional</FormHelperText>
            </Grid>
            <Grid item xs={3} sx={{ ml: 5, mb: 2, mt: 2 }}>
              <Typography>Upload File:</Typography>
            </Grid>
            <Grid item xs={6}>
              <FileUpload
                type={"claims"}
                disabled={false}
                file_info={localRowData.claims_file}
                setLocalRowData={setLocalRowData}
                localRowData={localRowData}
              />
            </Grid>
            <Grid item xs={4} sx={{ ml: 9, mt: 5 }}>
              <Button
                variant={"outlined"}
                color={"primary"}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Grid>
            <React.Fragment>
              <Grid item xs={3} sx={{ mt: 5 }}>
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
                      <Button onClick={handleCloseConfirm} variant={"outlined"}>
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button onClick={newClaims} variant={"outlined"}>
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
