import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import {
  LinearProgress,
  Button,
  TableCell,
  Container,
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Grid,
  Tooltip
} from "@mui/material";
import { tableStyle, tableHeader, tableBox, tableButton } from "../../Styles";
import AddClaims from "./AddClaims";
import ViewClaims from "./ViewClaims";
import moment from "moment";
import ClaimsOverview from "./ClaimsOverview";
function createData(
  id,
  claims_type,
  claims_amount,
  claims_date,
  claims_approver_name,
  claims_remark,
  claims_file,
  claims_last_updated,
  claims_status,
  claims_id
) {
  return {
    id,
    claims_type,
    claims_amount,
    claims_date,
    claims_approver_name,
    claims_remark,
    claims_file,
    claims_last_updated,
    claims_status,
    claims_id,
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
    id: "claims_type",
    numeric: true,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "claims_amount",
    numeric: true,
    disablePadding: false,
    label: "Amount",
  },
  {
    id: "claims_date",
    numeric: true,
    disablePadding: false,
    label: "Claims Date",
  },
  {
    id: "claims_approver_name",
    numeric: true,
    disablePadding: false,
    label: "Approved by",
  },
  {
    id: "claims_remark",
    numeric: true,
    disablePadding: false,
    label: "Remark",
  },
  {
    id: "claims_file",
    numeric: true,
    disablePadding: false,
    label: "File",
  },
  {
    id: "claims_last_updated",
    numeric: true,
    disablePadding: false,
    label: "Last Updated",
  },
  {
    id: "claims_status",
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openViewClaims, setOpenViewClaims] = useState(false);
  const [claimsTable, setClaimsTable] = useState([]);
  const [quotaData, setQuotaData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [onLoad, setOnLoad] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackState, setSnackState] = useState({
    vertical: "top",
    horizontal: "center",
    snackMessage: "",
    snackColor: "",
  });
  const { vertical, horizontal, snackMessage, snackColor } = snackState;
  const [loadClaims, setLoadClaims] = useState(0);

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

  const viewClaimModal = (rowId) => {
    setOpenViewClaims(true);
    setRowData(rowId);
  };

  const handleSnackbar = (message, color) => {
    setOpenSnackbar(true);
    setSnackState({
      ...snackState,
      snackMessage: message,
      snackColor: color,
    });
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - claimsTable.length) : 0;
  async function retrieveClaimsData() {
    if (loginID === "4") {
      setOnLoad(false);
    } else {
      setOnLoad(true);
    }
    setLoadClaims(loginID);
    var claimsData = [];
    await axios
      .get("/getClaims", { params: { employeeId: loginID } })
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          claimsData.push(
            createData(
              i + 1,
              response.data[i].claims_type,
              response.data[i].claims_amount,
              response.data[i].claims_date,
              response.data[i].claims_approver_name,
              response.data[i].claims_remark,
              response.data[i].claims_file,
              response.data[i].claims_last_updated,
              response.data[i].claims_status,
              response.data[i].claims_id
            )
          );
        }
      });
    setClaimsTable(claimsData);
    setOnLoad(false);
  }

  async function retrieveClaimsQuota() {
    var quotaData = [];
    const sumData = {
      dental: 0,
      transport: 0,
      medical: 0,
    };

    const startQuota = {
      dental: 2500,
      transport: 1000,
      medical: 2000,
    };
    await axios
      .get("/getClaimsQuota", { params: { employeeId: loginID } })
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          quotaData.push(response.data[i]);
          console.log(quotaData);
        }
      });
    for (let i = 0; i < quotaData.length; i++) {
      if (quotaData[i].claims_type === "Dental") {
        sumData.dental = quotaData[i].amount;
      } else if (quotaData[i].claims_type === "Transport") {
        sumData.transport = quotaData[i].amount;
      } else if (quotaData[i].claims_type === "Medical") {
        sumData.medical = quotaData[i].amount;
      }
    }
    const endQuota = {
      dental: startQuota.dental - sumData.dental,
      transport: startQuota.transport - sumData.transport,
      medical: startQuota.medical - sumData.medical,
    };
    console.log(sumData);
    setQuotaData(endQuota);
  }

  useEffect(() => {
    retrieveClaimsData();
    retrieveClaimsQuota();
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
          <LinearProgress></LinearProgress>
        </Box>
      </Container>
    );
  } else {
    return (
      <Container>
        <Box sx={tableBox}>
          <Typography sx={tableHeader} variant={"h2"}>
            Claims Summary
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
                  rowCount={claimsTable.length}
                />
                <TableBody>
                  {stableSort(claimsTable, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <Tooltip title={tooltipText(row.claims_status)} followCursor>
                          <TableRow
                            hover
                            tabIndex={-1}
                            key={row.id}
                            onClick={() => viewClaimModal(row)}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                              align="right"
                            >
                              {row.id}
                            </TableCell>
                            <TableCell align="right">{row.claims_type}</TableCell>
                            <TableCell align="right">
                              {row.claims_amount}
                            </TableCell>
                            <TableCell align="right">
                              {moment(row.claims_date).format("DD MMM yyyy")}
                            </TableCell>
                            <TableCell align="right">
                              {row.claims_approver_name}
                            </TableCell>
                            <TableCell align="right">
                              {row.claims_remark}
                            </TableCell>
                            {row.claims_file ? (
                              <TableCell align="right">
                                <Button
                                  target="_blank"
                                  href={row.claims_file}
                                  onClick={() => setOpenViewClaims(false)}
                                >
                                  {row.claims_file.split("/")[4]}
                                </Button>
                              </TableCell>
                            ) : (
                              <TableCell align="right">
                               <Button disabled>No File</Button>
                              </TableCell>
                            )}
                            <TableCell align="right">
                              {moment(row.claims_last_updated).format(
                                "DD MMM yyyy HH:mm"
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {row.claims_status}
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
              count={claimsTable.length}
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
          <Grid item xs={5}>

            <ClaimsOverview quotaData={quotaData} />

          </Grid>
      
            <Grid item>
              <AddClaims
                retrieveClaimsData={retrieveClaimsData}
                quotaData={quotaData}
                handleSnackbar={handleSnackbar}
              />
            </Grid>
          
        </Grid>
        <ViewClaims
          quotaData={quotaData}
          openViewClaims={openViewClaims}
          rowData={rowData}
          setOpenViewClaims={setOpenViewClaims}
          retrieveClaimsData={retrieveClaimsData}
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
