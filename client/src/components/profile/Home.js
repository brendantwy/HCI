import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardActions, CardContent, Skeleton, Container } from '@mui/material'
import { useHistory, Link } from "react-router-dom";
import { style2, homeCard, cardStyles, tableHeader, tableBox } from '../../Styles';
import axios from "axios";
import CardList from "./CardList";
const loginID = localStorage.getItem("employeeId");

function leavesField(
  id,
  leaves_type,
  leaves_start_date,
  leaves_start_time,
  leaves_end_date,
  leaves_end_time,
  leaves_approver_name,
  leaves_remarks,
  leaves_file,
  leaves_status
) {
  return {
    id,
    leaves_type,
    leaves_start_date,
    leaves_start_time,
    leaves_end_date,
    leaves_end_time,
    leaves_approver_name,
    leaves_remarks,
    leaves_file,
    leaves_status,
  };
}
function claimsField(
  id,
  claims_type,
  claims_amount,
  claims_date_uploaded,
  claims_approver_name,
  claims_remark,
  claims_file,
  claims_last_updated,
  claims_status
) {
  return {
    id,
    claims_type,
    claims_amount,
    claims_date_uploaded,
    claims_approver_name,
    claims_remark,
    claims_file,
    claims_last_updated,
    claims_status,
  };
}
export default function HomePage(props) {
  const { location } = props;
  const [leavesTable, setLeavesTable] = useState([]);
  const [claimsTable, setClaimsTable] = useState([]);
  const [calendarTable, setCalendarTable] = useState([]);
  const [pageLoad, setPageLoad] = useState(false);
  var userId = "";
  const loginUserId = () => {
    if (loginID) {
      userId= JSON.stringify(loginID);
    }
    else {
      userId= JSON.stringify(location.state.userId);
    }
  };
  function navigateTo(page) {
    history.push(page);
  }
  const getLeaves = async () => {
    var leaveData = [];
    const res = await axios
      .get("/getLeaves", { params: { employeeId: userId } })
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          leaveData.push(
            leavesField(
              i + 1,
              response.data[i].leaves_type,
              response.data[i].leaves_start_date,
              response.data[i].leaves_start_time,
              response.data[i].leaves_end_date,
              response.data[i].leaves_end_time,
              response.data[i].leaves_approver_name,
              response.data[i].leaves_remarks,
              response.data[i].leaves_file,
              response.data[i].leaves_status
            )
          );
        }
      });
    setLeavesTable(leaveData);
    setPageLoad(false);
  }
  const getClaims = async () => {
    var claimsData = [];
    const res = await axios
      .get("/getClaims", { params: { employeeId: userId } })
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          claimsData.push(
            claimsField(
              i + 1,
              response.data[i].claims_type,
              response.data[i].claims_amount,
              response.data[i].claims_date_uploaded,
              response.data[i].claims_approver_name,
              response.data[i].claims_remark,
              response.data[i].claims_file,
              response.data[i].claims_last_updated,
              response.data[i].claims_status
            )
          );
        }
      });
    setClaimsTable(claimsData);
  };

  const getCalendar = async () => {
    setPageLoad(true);
    var calendarObj = [];
    const res = await axios.get("/getDeptNext7Days",
      {
        params: { employeeId: userId }
      }).then((response) => {
        console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          calendarObj.push({
            id: response.data[i].event_id,
            name: response.data[i].employee_name,
            title: response.data[i].event_details,
            allDay: false,
            start: new Date(response.data[i].start_date),
            end: new Date(response.data[i].end_date)
          })
        }
        console.log('FUTURE CALENDAR');

      });
    setCalendarTable(calendarObj);
  }
  useEffect(() => {
    loginUserId();
    getCalendar();
    getClaims();
    getLeaves();
  }, [])


  const renderSkeleton = () => {
    return (
      <Card sx={homeCard}>
        <Skeleton variant="rectangular" animation="wave" flexGrow={1} height={400} />
      </Card>
    )
  }

  const history = useHistory();

  if (pageLoad === true) {
    return (
      <Container>
        <Box sx={tableBox}>
          <Typography sx={tableHeader} variant={"h2"}>
            Home
          </Typography>
          <Box sx={cardStyles}>
            {renderSkeleton()}
            {renderSkeleton()}
            {renderSkeleton()}
          </Box>
        </Box>
      </Container >
    )
  }
  else {
    return (
      <Container>
        <Box sx={tableBox}>
          <Typography sx={tableHeader} variant={"h2"}>
            Home
          </Typography>
          <Box sx={cardStyles}>
            <CardList cardType={'Leaves'} dataTable={leavesTable} navigateTo={navigateTo} />
            <CardList cardType={'Claims'} dataTable={claimsTable} navigateTo={navigateTo} />
            <CardList cardType={'Calendar'} dataTable={calendarTable} navigateTo={navigateTo} />
          </Box>
        </Box>
      </Container >
    );
  }
}
