const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const mysql = require("mysql");
const { Client } = require("ssh2");
const moment = require("moment");
app.use(express.json());
const appConfig = require("./client/appConfig");

const db = mysql.createPool({
  host: appConfig.host,
  port: appConfig.port,
  user: appConfig.user,
  password: appConfig.password,
  database: appConfig.database,
});
app.use(fileUpload());
app.use(express.static("public"));
app.use("/leaves", express.static("leaves"));
app.use("/claims", express.static("claims"));

app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  const type = req.body.type;

  file.mv(`${__dirname}/public/${type}/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({
      fileName: file.name,
      filePath: `${appConfig.proxy}/${type}/${file.name}`,
    });
  });
});

app.post("/login", (req, res) => {
  var employeeId = 0;
  try {
    employeeEmail = req.body[0].user;
  } catch (err) {
    console.log("No username entered");
  }
  try {
    employeePassword = req.body[1].password;
  } catch (err) {
    console.log("No password entered");
  }
  let userStatus = false;
  let passwordStatus = false;
  //Check if username match
  if (employeeEmail && employeePassword) {
    const sqlCheckUsername = `SELECT employee_id FROM employee WHERE employee_email = '${employeeEmail}';`;
    db.query(sqlCheckUsername, (err, result) => {
      if (result.length === 0) {
        userStatus = false;
      } else {
        console.log(result);
        console.log(result[0].employee_id);
        employeeId = result[0].employee_id;
        userStatus = true;
      }
    });

    const sqlCheckPassword = `SELECT employee_id FROM employee WHERE employee_email = '${employeeEmail}' AND employee_password = '${employeePassword}';`;
    db.query(sqlCheckPassword, (err, result) => {
      if (result.length === 0) {
        passwordStatus = false;
      } else {
        console.log(result[0].employee_id);
        employeeId = result[0].employee_id;
        passwordStatus = true;
      }
    });
  }

  setTimeout(() => {
    if (userStatus && passwordStatus) {
      console.log("Login success!");
      return res.send({ employeeId });
    }
  }, 500);
});

app.get("/", (req, res) => {
  res.send("hello austin");
});

app.get("/loadPage", (req, res) => {
  setTimeout(() => {
    res.send(JSON.stringify("ok"));
  }, 1500);
});

app.get("/getClaims", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `SELECT * from claims WHERE employee_id = ${employeeId} ;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    setTimeout(() => {
      res.send(JSON.stringify(result));
    }, 1500);
  });
});

app.get("/getLeaves", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `SELECT * from leaves WHERE employee_id = ${employeeId} ;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    setTimeout(() => {
      res.send(JSON.stringify(result));
    }, 1500);
  });
});

app.get("/getCalendar", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `SELECT  calendar.employee_id,employee.employee_name,event_id,event_details,start_date,end_date,start_time,end_time from calendar,employee WHERE calendar.employee_id in (select employee_id from employee where employee_department =(select employee_department from employee where employee_id=${employeeId})) AND employee.employee_id=calendar.employee_id;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    setTimeout(() => {
      res.send(JSON.stringify(result));
    }, 1500);
  });
});
app.get("/getCalendarLeaves", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `SELECT leaves_id,leaves.employee_id,employee.employee_name,leaves_status,leaves_end_time AS end_time,leaves_start_time AS start_time,leaves_start_date AS start_date,leaves_end_date AS end_date,leaves_type AS event_details FROM leaves,employee WHERE leaves.employee_id IN (SELECT employee_id FROM employee WHERE employee_department =(SELECT employee_department FROM employee WHERE employee_id=${employeeId})) AND leaves_status ='APPROVED' AND employee.employee_id=leaves.employee_id;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    setTimeout(() => {
      res.send(JSON.stringify(result));
    }, 1500);
  });
});

app.get("/getDeptLeaves", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `SELECT * FROM leaves WHERE employee_id IN (SELECT employee_id FROM employee WHERE employee_department =(SELECT employee_department FROM employee WHERE employee_id=${employeeId})) AND leaves_status ='APPROVED';`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.get("/getProfile", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `SELECT employee_id,employee_name,employee_department,employee_number,employee_email,employee_position FROM employee WHERE employee_id =${employeeId};`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    setTimeout(() => {
      res.send(JSON.stringify(result));
    }, 1500);
  });
});
app.get("/getOneEvent", (req, res) => {
  employeeId = req.query.employeeId;
  eventId = req.query.eventId;
  const sql = `SELECT employee.employee_name, event_id,calendar.employee_id,event_details,start_date,end_date,event_remarks,start_time,end_time FROM calendar,employee WHERE calendar.employee_id=employee.employee_id AND calendar.event_id=${eventId}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    setTimeout(() => {
      res.send(JSON.stringify(result));
    }, 1500);
  });
});
app.get("/getDeptFutureEvent", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `SELECT employee.employee_name, event_id,calendar.employee_id,event_details,start_date,end_date,event_remarks FROM calendar,employee WHERE calendar.employee_id=employee.employee_id AND calendar.event_id IN (SELECT event_id FROM calendar WHERE start_date>=CURRENT_DATE) AND employee.employee_department = (SELECT employee_department FROM employee WHERE employee_id=${employeeId})`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    setTimeout(() => {
      res.send(JSON.stringify(result));
    }, 1500);
  });
});
app.get("/getDeptNext7Days", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `SELECT employee.employee_name, event_id,calendar.employee_id,event_details,start_date,end_date,event_remarks FROM calendar,employee WHERE calendar.employee_id=employee.employee_id AND calendar.event_id IN (SELECT event_id FROM calendar WHERE start_date>=CURRENT_DATE AND end_date<=DATE_ADD(CURRENT_DATE,INTERVAL 7 DAY)) AND employee.employee_department = (SELECT employee_department FROM employee WHERE employee_id=${employeeId})`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    setTimeout(() => {
      res.send(JSON.stringify(result));
    }, 1500);
  });
});

app.post("/addEvent", (req, res) => {
  employeeId = req.body.employeeId;
  console.log(req.body.event);
  start_time = req.body.event.start_time;
  end_time = req.body.event.end_time;
  event_details = req.body.event_details;
  var newStart = new Date(req.body.event.start_date);
  var newEnd = new Date(req.body.event.end_date);

  start_date = moment(newStart).format("YYYY-MM-DD");
  end_date = moment(newEnd).format("YYYY-MM-DD");

  const sql = `INSERT INTO \`calendar\` ( \`employee_id\`, \`event_details\`, \`start_date\`, \`end_date\`, \`start_time\`, \`end_time\`) VALUES ( ${employeeId}, '${event_details}', '${start_date}', '${end_date}', '${start_time}', '${end_time}')`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.post("/editEvent", (req, res) => {
  eventId = req.body.eventId;
  employeeId = req.body.employeeId;
  start_time = req.body.event.start_time;
  end_time = req.body.event.end_time;
  event_details = req.body.event.event_details;

  var newStart = new Date(req.body.event.start_date);
  var newEnd = new Date(req.body.event.end_date);

  start_date = moment(newStart).format("YYYY-MM-DD");
  end_date = moment(newEnd).format("YYYY-MM-DD");
  const sql = `UPDATE \`2005_database\`.\`calendar\` SET \`event_details\` = '${event_details}', \`start_date\` = '${start_date}', \`end_date\` = '${end_date}', \`event_remarks\` = ' ', \`start_time\` = '${start_time}', \`end_time\` = '${end_time}' WHERE \`event_id\` = ${eventId}`;
  console.log(sql);
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.post("/deleteEvent", (req, res) => {
  eventId = req.body.eventId;
  const sql = `DELETE FROM \`2005_database\`.\`calendar\` WHERE (\`event_id\` = ${eventId});`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.post("/editClaims", (req, res) => {
  claims_id = req.body.rowData.claims_id;
  claims_type = req.body.rowData.claims_type;
  claims_amount = req.body.rowData.claims_amount;
  claims_date = req.body.rowData.claims_date;
  claims_last_updated = moment().format("YYYY-MM-DD");
  claims_approver_name = req.body.rowData.claims_approver_name;
  claims_remark = req.body.rowData.claims_remark;
  claims_file = req.body.rowData.claims_file;
  claims_status = req.body.rowData.claims_status;

  var newDate = new Date(req.body.rowData.claims_date);
  claims_date = moment(newDate).format("YYYY-MM-DD");

  const sql = `UPDATE \`2005_database\`.\`claims\` SET \`claims_type\` = '${claims_type}',\`claims_amount\` = ${claims_amount},\`claims_date\` = '${claims_date}',\`claims_approver_name\` = '${claims_approver_name}',\`claims_remark\` = '${claims_remark}', \`claims_file\`= '${claims_file}', \`claims_last_updated\` = '${claims_last_updated}',\`claims_status\` = '${claims_status}' WHERE \`claims_id\` = ${claims_id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.post("/deleteClaims", (req, res) => {
  claims_id = req.body.rowData.claims_id;
  const sql = `DELETE FROM \`2005_database\`.\`claims\` WHERE \`claims_id\` = ${claims_id}`;
  console.log(sql);
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.post("/addLeaves", (req, res) => {
  employeeId = req.body.employeeId;
  leaves_type = req.body.rowData.leaves_type;
  leaves_start_time = req.body.rowData.leaves_start_time;
  leaves_end_time = req.body.rowData.leaves_end_time;
  leaves_approver_name = req.body.rowData.leaves_approver_name;
  leaves_remarks = req.body.rowData.leaves_remarks;
  leaves_file = req.body.rowData.leaves_file;
  leaves_status = req.body.rowData.leaves_status;

  var newStart = new Date(req.body.rowData.leaves_start_date);
  var newEnd = new Date(req.body.rowData.leaves_end_date);
  leaves_start_date = moment(newStart).format("YYYY-MM-DD");
  leaves_end_date = moment(newEnd).format("YYYY-MM-DD");

  const sql = `INSERT INTO \`leaves\` (\`employee_id\`, \`leaves_status\`, \`leaves_file\`, \`leaves_approver_name\`, \`leaves_end_time\`, \`leaves_end_date\`, \`leaves_start_time\`, \`leaves_start_date\`, \`leaves_type\`) VALUES
  ( ${employeeId}, '${leaves_status}', '${leaves_file}', '${leaves_approver_name}', '${leaves_end_time}', '${leaves_end_date}', '${leaves_start_time}', '${leaves_start_date}', '${leaves_type}');`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.post("/editLeaves", (req, res) => {
  employeeId = req.body.employeeId;
  leaves_id = req.body.rowData.leaves_id;
  leaves_type = req.body.rowData.leaves_type;
  leaves_start_time = req.body.rowData.leaves_start_time;
  leaves_end_time = req.body.rowData.leaves_end_time;
  leaves_approver_name = req.body.rowData.leaves_approver_name;
  leaves_remarks = req.body.rowData.leaves_remarks;
  leaves_file = req.body.rowData.leaves_file;
  leaves_status = req.body.rowData.leaves_status;

  var newStart = new Date(req.body.rowData.leaves_start_date);
  var newEnd = new Date(req.body.rowData.leaves_end_date);
  leaves_start_date = moment(newStart).format("YYYY-MM-DD");
  leaves_end_date = moment(newEnd).format("YYYY-MM-DD");

  const sql = `UPDATE \`2005_database\`.\`leaves\` SET \`leaves_approver_name\` = '${leaves_approver_name}', \`leaves_end_time\` = '${leaves_end_time}',\`leaves_end_date\` = '${leaves_end_date}', 
  \`leaves_start_time\` = '${leaves_start_time}', \`leaves_start_date\` = '${leaves_start_date}', \`leaves_type\` = '${leaves_type}', \`leaves_remarks\` = '${leaves_remarks}',\`leaves_status\` = '${leaves_status}',\`leaves_file\` = '${leaves_file}' WHERE \`leaves_id\` = ${leaves_id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});
app.post("/deleteLeaves", (req, res) => {
  leaves_id = req.body.rowData.leaves_id;
  console.log(leaves_id);
  const sql = `DELETE FROM \`2005_database\`.\`leaves\` WHERE \`leaves_id\` = ${leaves_id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.post("/addClaims", (req, res) => {
  employeeId = req.body.employeeId;
  claims_type = req.body.rowData.claims_type;
  claims_amount = req.body.rowData.claims_amount;
  claims_date = req.body.rowData.claims_date;
  claims_approver_name = req.body.rowData.claims_approver_name;
  claims_remark = req.body.rowData.claims_remark;
  claims_file = req.body.rowData.claims_file;
  claims_last_updated = moment().format("YYYY-MM-DD LTS").slice(0, -3);
  claims_status = req.body.rowData.claims_status;

  var newDate = new Date(req.body.rowData.claims_date);
  claims_date = moment(newDate).format("YYYY-MM-DD");

  const sql = `INSERT INTO \`claims\` ( \`employee_id\`, \`claims_type\`, \`claims_amount\`, \`claims_date\`, \`claims_approver_name\`, \`claims_remark\`, \`claims_file\`,\`claims_last_updated\`, \`claims_status\`) VALUES
  ( ${employeeId}, '${claims_type}', ${claims_amount}, '${claims_date}', '${claims_approver_name}', '${claims_remark}','${claims_file}', '${claims_last_updated}', '${claims_status}');`;
  console.log(sql);
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.get("/getLeavesQuota", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `select leaves_type, Datediff(leaves_start_date, leaves_end_date) as diff from leaves where employee_id=${employeeId};`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.get("/getClaimsQuota", (req, res) => {
  employeeId = req.query.employeeId;
  const sql = `select claims_type, sum(claims_amount) as amount from claims where employee_id=${employeeId} group by claims_type;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.listen(5000, () => console.log("Server Started"));
