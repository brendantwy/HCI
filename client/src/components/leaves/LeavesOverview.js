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
import LinearProgress from "@mui/material/LinearProgress";

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

export default function LeavesOverview2(props) {
  const { quotaData } = props;
  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            sx={{ height: 20, borderRadius: 20 }}
            value={props.value}
          />
        </Box>
        <Box sx={{ minWidth: 55 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.name[0]
          )}/${props.name[1]}`}</Typography>
        </Box>
      </Box>
    );
  }
  return (
    <Grid container direction="row" rowSpacing={2}>
      <Grid item xs={10} textAlign={"center"}>
        <Typography variant={'h5'}>Leaves Balance</Typography>
      </Grid>
      <Grid item xs={3}>
        Annual
      </Grid>
      <Grid item xs={9}>
        <LinearProgressWithLabel
          value={(quotaData.annual / 14) * 100}
          name={[quotaData.annual, 14]}
        />
      </Grid>
      <Grid item xs={3}>
        Medical
      </Grid>
      <Grid item xs={9}>
        <LinearProgressWithLabel
          value={(quotaData.medical / 100) * 100}
          name={[quotaData.medical, 100]}
        />
      </Grid>
      <Grid item xs={3}>
        Childcare
      </Grid>
      <Grid item xs={9}>
        <LinearProgressWithLabel
          value={(quotaData.childcare / 50) * 100}
          name={[quotaData.childcare, 50]}
        />
      </Grid>
      <Grid item xs={3}>
        Parental
      </Grid>
      <Grid item xs={9}>
        <LinearProgressWithLabel
          value={(quotaData.parental / 90) * 100}
          name={[quotaData.parental, 90]}
        />
      </Grid>
    </Grid>
  );
}
