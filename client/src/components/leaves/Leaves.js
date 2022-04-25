import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  LinearProgress,
  Container,
  Snackbar,
  Alert,
  Grid, Tooltip
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import AddLeaves from "./AddLeaves";
import Button from "@mui/material/Button";
import ViewLeaves from "./ViewLeaves";
import moment from "moment";
import LeavesOverview from "./LeavesOverview";
import {
  tableStyle,
  tableHeader,
  tableBox,
  tableButton,
  tableExtra,
  containerStyles,
} from "../../Styles";
import LeavesOverview2 from "./LeavesOverview";

function createData(
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
  leaves_id
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
    leaves_id,
  };
}

const loginID = localStorage.getItem("employeeId");

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "S/N",
  },
  {
    id: "leaves_type",
    numeric: true,
    disablePadding: false,
    label: "Leave Type",
  },
  {
    id: "leaves_start_date",
    numeric: true,
    disablePadding: false,
    label: "Start Date",
  },
  {
    id: "leaves_start_time",
    numeric: true,
    disablePadding: false,
    label: "Start Time",
  },
  {
    id: "leaves_end_date",
    numeric: true,
    disablePadding: false,
    label: "End Date",
  },
  {
    id: "leaves_end_time",
    numeric: true,
    disablePadding: false,
    label: "End Time",
  },
  {
    id: "leaves_approver_name",
    numeric: true,
    disablePadding: false,
    label: "Approved By",
  },
  {
    id: "leaves_remark",
    numeric: true,
    disablePadding: false,
    label: "Remark",
  },
  {
    id: "leaves_file",
    numeric: true,
    disablePadding: false,
    label: "File",
  },
  {
    id: "leaves_status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [leavesTable, setLeavesTable] = useState([]);
  const [quotaData, setQuotaData] = useState([]);
  const [openViewLeaves, setOpenViewLeaves] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [onLoad, setOnLoad] = useState(false);
  const [selected, setSelected] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackState, setSnackState] = useState({
    vertical: "top",
    horizontal: "center",
    snackMessage: "",
    snackColor: "",
  });
  const { vertical, horizontal, snackMessage, snackColor } = snackState;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const viewLeaveModal = (rowId) => {
    setSelected(rowId.id);
    setOpenViewLeaves(true);
    setRowData(rowId);
  };

  const isSelected = (rowId) => {
    return selected === rowId;
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - leavesTable.length) : 0;

  async function retrieveLeavesData() {
    if (loginID === "4") {
      console.log(loginID);
      setOnLoad(false);
    } else {
      setOnLoad(true);
    }
    var leavesData = [];
    await axios
      .get("/getLeaves", { params: { employeeId: loginID } })
      .then((response) => {
        console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          leavesData.push(
            createData(
              i + 1,
              response.data[i].leaves_type,
              response.data[i].leaves_start_date,
              response.data[i].leaves_start_time,
              response.data[i].leaves_end_date,
              response.data[i].leaves_end_time,
              response.data[i].leaves_approver_name,
              response.data[i].leaves_remarks,
              response.data[i].leaves_file,
              response.data[i].leaves_status,
              response.data[i].leaves_id
            )
          );
        }
      });

    setLeavesTable(leavesData);
    setOnLoad(false);
  }

  async function retrieveLeavesQuota() {
    var quotaData = [];
    const sumData = {
      annual: 0,
      medical: 0,
      childcare: 0,
      parental: 0,
    };
    const startQuota = {
      annual: 14,
      medical: 100,
      childcare: 50,
      parental: 90,
    };
    await axios
      .get("/getLeavesQuota", { params: { employeeId: loginID } })
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          quotaData.push(response.data[i]);
        }
      });
    for (let i = 0; i < quotaData.length; i++) {
      if (quotaData[i].leaves_type === "Annual Leave") {
        if (quotaData[i].diff === 0) {
          sumData.annual += 1;
        } else {
          sumData.annual += Math.abs(quotaData[i].diff);
        }
      } else if (quotaData[i].leaves_type === "Medical") {
        if (quotaData[i].diff === 0) {
          sumData.medical += 1;
        } else {
          sumData.medical += Math.abs(quotaData[i].diff);
        }
      } else if (quotaData[i].leaves_type === "Childcare") {
        if (quotaData[i].diff === 0) {
          sumData.childcare += 1;
        } else {
          sumData.childcare += Math.abs(quotaData[i].diff);
        }
      } else if (quotaData[i].leaves_type === "Parental") {
        if (quotaData[i].diff === 0) {
          sumData.parental += 1;
        } else {
          sumData.parental += Math.abs(quotaData[i].diff);
        }
      }
    }
    const endQuota = {
      annual: startQuota.annual - sumData.annual,
      medical: startQuota.medical - sumData.medical,
      childcare: startQuota.childcare - sumData.childcare,
      parental: startQuota.parental - sumData.parental,
    };
    setQuotaData(endQuota);
  }

  const handleSnackbar = (message, color) => {
    setOpenSnackbar(true);
    setSnackState({
      ...snackState,
      snackMessage: message,
      snackColor: color,
    });
  };

  useEffect(() => {
    retrieveLeavesData();
    retrieveLeavesQuota();
  }, []);

  const tooltipText = (status) => {
    if (status === "PENDING") {
      return "Click to Edit"
    }
    if (status === "APPROVED") {
      return "Click to View"
    }
    if (status === "REJECTED") {
      return "Click to View"
    }

  }

  if (onLoad) {
    return (
      <Container>
        <Box sx={tableBox}>
          <LinearProgress />
        </Box>
      </Container>
    );
  } else {
    return (
      <Container>
        <Box sx={tableBox}>
          <Typography sx={tableHeader} variant={"h2"}>
            Leaves Summary
          </Typography>
          <Paper sx={tableStyle}>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size="small"
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={leavesTable.length}
                />
                <TableBody>
                  {stableSort(leavesTable, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <Tooltip title={tooltipText(row.leaves_status)} followCursor>
                          <TableRow
                            hover
                            onClick={() => viewLeaveModal(row)}
                            tabIndex={-1}
                            key={row.id}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                              align="right"
                            >
                              {row.id}
                            </TableCell>
                            <TableCell width="10%" align="right">
                              {row.leaves_type}
                            </TableCell>
                            <TableCell align="right">
                              {moment(row.leaves_start_date).format(
                                "DD MMM yyyy"
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {row.leaves_start_time}
                            </TableCell>
                            <TableCell align="right">
                              {moment(row.leaves_end_date).format("DD MMM yyyy")}
                            </TableCell>
                            <TableCell align="right">
                              {row.leaves_end_time}
                            </TableCell>
                            <TableCell align="right">
                              {row.leaves_approver_name}
                            </TableCell>
                            <TableCell align="right">
                              {row.leaves_remarks}
                            </TableCell>
                            {row.leaves_file ? (
                              <TableCell align="right" onClick={null}>
                                <Button
                                  target="_blank"
                                  href={row.leaves_file}
                                  onClick={() => setOpenViewLeaves(false)}
                                >
                                  {row.leaves_file.split("/")[4]}
                                </Button>
                              </TableCell>
                            ) : (
                              <TableCell align="right">
                                <Button disabled>No File</Button>
                              </TableCell>
                            )}
                            <TableCell align="right">
                              {row.leaves_status}
                            </TableCell>
                          </TableRow>
                        </Tooltip>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={leavesTable.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={3}>

            <LeavesOverview quotaData={quotaData} />

          </Grid>
    
            <Grid item>
              <AddLeaves
                retrieveLeavesData={retrieveLeavesData}
                quotaData={quotaData}
                handleSnackbar={handleSnackbar}
              />
            </Grid>
       
        </Grid>
        <ViewLeaves
          quotaData={quotaData}
          openViewLeaves={openViewLeaves}
          rowData={rowData}
          setOpenViewLeaves={setOpenViewLeaves}
          retrieveLeavesData={retrieveLeavesData}
          handleSnackbar={handleSnackbar}
        />
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          key={vertical + horizontal}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackState.snackColor}
            sx={{ width: "100%" }}
          >
            {snackState.snackMessage}
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}
