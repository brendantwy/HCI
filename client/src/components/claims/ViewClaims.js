import {
  Box,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Card,
  Button,
  Modal,
  TextField,
  Grid,
  IconButton,
  FormHelperText,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { style2 } from "../../Styles";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FileUpload from "../common/FileUpload";

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
  claims_type,
  claims_amount,
  claims_date,
  claims_approver_name
) {
  return {
    claims_type: claims_type === "",
    claims_amount: claims_amount === "",
    claims_date: claims_date === null,
    claims_approver_name: claims_approver_name === "",
  };
}
export default function ViewClaims(props) {
  const {
    rowData,
    openViewClaims,
    setOpenViewClaims,
    retrieveClaimsData,
    handleSnackbar,
    quotaData,
  } = props;
  const [open, setOpen] = useState(false);
  const [localRowData, setLocalRowData] = useState({});
  const [oldRowData, setOldRowData] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [buttonProp, setButtonProp] = useState({});

  const quotaCheck = () => {
    switch (localRowData.claims_type) {
      case "Dental":
        if (
          quotaData.dental + oldRowData.claims_amount <
          localRowData.claims_amount
        ) {
          return true;
        } else {
          return false;
        }
      case "Transport":
        if (
          quotaData.transport + oldRowData.claims_amount <
          localRowData.claims_amount
        ) {
          return true;
        } else {
          return false;
        }
      case "Medical":
        if (
          quotaData.medical + oldRowData.claims_amount <
          localRowData.claims_amount
        ) {
          return true;
        } else {
          return false;
        }
    }
  };
  const setField = (event) => {
    setLocalRowData({
      ...localRowData,
      [event.target.name]: [event.target.value],
    });
    console.log(event.target.value);
  };

  const handleOpen = (event) => {
    console.log(event.target.name);
    if (event.target.name === "Delete") {
      setButtonProp({
        buttonText: "Delete",
        buttonColor: "error",
        buttonClick: deleteClaims,
      });
    } else {
      if (quotaCheck()) {
        alert(`Not enough ${localRowData.claims_type} quota!`);
      } else {
        setButtonProp({
          buttonText: "Update",
          buttonColor: "primary",
          buttonClick: updateClaims,
        });
      }
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseViewClaims = () => {
    setOpenViewClaims(false);
  };
  const updateClaims = async () => {
    try {
      const res = await axios
        .post(
          "/editClaims",
          {
            rowData: localRowData,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          console.log("response" + response);
        });
      handleClose();
      handleCloseViewClaims();
      retrieveClaimsData();
      handleSnackbar("Claims Updated Successfully!", "success");
    } catch (err) {
      console.log(err);
      handleSnackbar("Error!", "error");
    }
  };
  const deleteClaims = async () => {
    try {
      const res = await axios
        .post(
          "/deleteClaims",
          {
            rowData: localRowData,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          console.log("response" + response);
        });
      handleClose();
      handleCloseViewClaims();
      retrieveClaimsData();
      handleSnackbar("Claims Deleted Successfully!", "success");
    } catch (err) {
      console.log(err);
      handleSnackbar("Error!", "error");
    }
  };
  useEffect(() => {
    if (rowData.claims_status === "APPROVED") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    setLocalRowData(rowData);
    setOldRowData(rowData);
  }, [rowData]);

  const errors = validateFields(
    localRowData.claims_type,
    localRowData.claims_amount,
    localRowData.claims_date,
    localRowData.claims_approver_name
  );

  const markRed = (field) => {
    const hasError = errors[field];
    return hasError;
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

  const textToDate = (event) => {
    const date = new Date(event.target.value);
    setDateField("leaves_start_date", date);
  };

  return (
    <Modal
      open={openViewClaims}
      onClose={handleCloseViewClaims}
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
            <Typography variant="h4">View Claims</Typography>
          </Grid>
          <Grid item xs={1} textAlign="center">
            <IconButton color={"error"} onClick={handleCloseViewClaims}>
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
              <Select
                disabled={disabled}
                size="small"
                sx={{ mt: 1 }}
                name="claims_type"
                value={localRowData.claims_type}
                onChange={setField}
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
            <FormControl error={markRed("claims_amount")}>
              <TextField
                disabled={disabled}
                size="small"
                label="SGD"
                name="claims_amount"
                variant="outlined"
                value={localRowData.claims_amount}
                onChange={setField}
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
                  disabled={disabled}
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
              <Select
                disabled={disabled}
                size="small"
                sx={{ mt: 1 }}
                name="claims_approver_name"
                value={localRowData.claims_approver_name}
                onChange={setField}
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
              label="Remarks"
              name="claims_remark"
              size="small"
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
              disabled={disabled}
              file_info={localRowData.claims_file}
              setLocalRowData={setLocalRowData}
              localRowData={localRowData}
            />
          </Grid>
          <Grid item xs={4}>
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
          <React.Fragment>
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
