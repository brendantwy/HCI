import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios';
import { Alert, Snackbar, Modal, Card, Typography, Button, InputLabel, FormControl, Container, Paper, CardContent, TextField, Box, Skeleton, CardActions, LinearProgress, Tooltip } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ViewEvent from './ViewEvent';
import NewEvent from './NewEvent';
import { style2, tableBox, tableHeader, tableStyle } from '../../Styles';
import { useHistory } from 'react-router-dom';

const loginID = localStorage.getItem("employeeId");
const localizer = momentLocalizer(moment)



const MyCalendar = (props) => {
  const history = useHistory();
  const [eventList, setEventList] = useState([]);
  const [initItem, setinitItem] = useState('');
  const [initExisting, setInitExisting] = useState({});
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState(false);
  const [confirmEvent, setConfirmEvent] = useState(false);
  const [description, setDescription] = useState('');
  const [loadModal, setLoadModal] = useState(false);
  const [editable, setEditable] = useState(false);
  const [isError, setIsError] = useState(false);
  const [buttonProp, setButtonProp] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackState, setSnackState] = useState({
    vertical: "top",
    horizontal: "center",
    snackMessage: "",
    snackColor: "",
  });
  const { vertical, horizontal, snackMessage, snackColor } = snackState;

  const openModal = async (event) => {
    if (event.id === undefined) {
      history.push("/Leaves");
    }
    else {
      setOpen(true);
      handleLoad(true);
      const res = await axios.get("/getOneEvent",
        {
          params: { employeeId: loginID, eventId: event.id }
        }).then((response) => {
          setInitExisting(response.data[0]);
        });
      handleLoad(false);
    }
  };
  useEffect(() => {
    if (initExisting.employee_id != loginID || initExisting.start_date< new Date()) {
      setEditable(false);
    }
    else {
      setEditable(true);
    }
  }, [initExisting])

  const handleLoad = (obj) => {
    console.log('before' + obj);
    setLoadModal(obj);
  }
  const handleDescription = (event) => {
    var update = event.target.value;
    setDescription(update);
  }

  const setNewDateField = (name, date) => {
    setinitItem({
      ...initItem,
      [name]: date,
    });
  };

  const setNewTextField = (name) => {
    if (name === "start_date") {
      if (initItem.start_date === null) {
        setinitItem({
          ...initExisting,
          [name]: " ",
        });
      }
    } else {
      if (initItem.end_date === null) {
        setinitItem({
          ...initItem,
          [name]: " ",
        });
      }
    }
  };

  const setDateField = (name, date) => {
    setInitExisting({
      ...initExisting,
      [name]: date,
    });
  };
  const setTextField = (name) => {
    if (name === "start_date") {
      if (initExisting.start_date === null) {
        setInitExisting({
          ...initExisting,
          [name]: " ",
        });
      }
    } else {
      if (initExisting.end_date === null) {
        setInitExisting({
          ...initExisting,
          [name]: " ",
        });
      }
    }
  };
  const handleOpen = (event) => {
    console.log(event.target.name);
    setConfirmEvent(true);
    if (event.target.name === "Delete") {
      setButtonProp({
        buttontext: "Delete",
        buttonColor: "error",
        buttonClick: handleDelete,
      });
    } else {
      setButtonProp({
        buttonText: "Update",
        buttonColor: "primary",
        buttonClick: handleUpdate,
      });
    }

  };

  const handleClose = () => {
    setOpen(false);
    setNewEvent(false);
    setIsError(false);
    setConfirmEvent(false);
  }

  const initEvent = async ({ start, end }) => {
    var startDate = new Date(start)
    var today = new Date()
    if(startDate < today){
      console.log("CANNOT CREATE")
    }
    setNewEvent(true);
    handleLoad(true);
    const res = await axios.get("/getProfile",
      {
        params: { employeeId: loginID }
      }).then((response) => {
        console.log(response.data[0]);
        setinitItem(response.data[0]);

      });
    handleLoad(false);
  }

  const handleUpdate = async (event) => {
    try {
      console.log(initExisting);
      const res = await axios.post('/editEvent', {
        eventId: event,
        employeeId: loginID,
        event:initExisting,

      }, { headers: { 'Content-Type': 'application/json' } }
      ).then((response) => {
        console.log('response' + response);
      })
      setDescription('');
      handleClose();
      loadCalendar();
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = async (event) => {
    try {
      const res = await axios.post('/deleteEvent', {
        eventId: event,

      }, { headers: { 'Content-Type': 'application/json' } }
      ).then((response) => {
        console.log('response' + response);

      })
      setInitExisting('');
      setDescription('');
      handleClose();
      loadCalendar();
    } catch (err) {
      console.log(err);
    }
  }

  const createEvent = async () => {
    if (description === '') {
      setIsError(true);
    }
    else {
      try {
        // console.log(initItem);
        const res = await axios.post('/addEvent', {
          employeeId: loginID,
          event:initItem,
          event_details: description

        }, { headers: { 'Content-Type': 'application/json' } }
        ).then((response) => {
          console.log('response' + response);
          setEventList([
            ...eventList,
            {
              title: description,
              start: initItem.start_date,
              end: initItem.end_date,
              allDay: false,
            }
          ])
        })
        setDescription('');
        handleClose();
        loadCalendar();
      } catch (err) {
        console.log(err);
      }
    }
    // console.log(description + startDate + endDate);
  }
  useEffect(() => {
    loadCalendar();
  }, [eventList]);
  async function loadCalendar() {
    var calendarObj = [];
    const res = await axios.get("/getCalendar",
      {
        params: { employeeId: loginID }
      }).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          calendarObj.push({
            id: response.data[i].event_id,
            title: response.data[i].event_details + ' - ' + response.data[i].employee_name,
            allDay: false,
            start: new Date(response.data[i].start_date),
            end: new Date(response.data[i].end_date)
          })
        }
      });
    const res2 = await axios.get("/getCalendarLeaves",
      {
        params: { employeeId: loginID }
      }).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          calendarObj.push({
            id: undefined,
            title: response.data[i].event_details + ' Leave - ' + response.data[i].employee_name,
            allDay: false,
            start: new Date(response.data[i].start_date),
            end: new Date(response.data[i].end_date)
          })
        }
      });
    setEventList(calendarObj);
  }
  if (eventList.length === 0) {
    return (
      <Container>
        <Box sx={tableBox}>
          <LinearProgress />
        </Box>
      </Container>
    )
  } else {

    return (
      <Container>
        <Box sx={tableBox}>
          <Typography sx={tableHeader} variant={'h2'}>Calendar</Typography>
          <Paper sx={tableStyle}>
            <Calendar
              popup
              selectable
              localizer={localizer}
              views={{ month: true, agenda: true }}
              events={eventList}
              showMultiDayTimes={true}
              style={{ height: 500 }}
              onSelectEvent={event => openModal(event)}
              onSelectSlot={initEvent} />
            <ViewEvent
              loadModal={loadModal}
              setOpen={setOpen}
              open={open}
              handleClose={handleClose}
              initExisting={initExisting}
              buttonProp={buttonProp}
              handleDescription={handleDescription}
              editable={editable}
              handleUpdate={handleUpdate}
              setDateField={setDateField}
              setTextField={setTextField}
              confirmEvent={confirmEvent}
              setNewTextField={setNewTextField}
              handleOpen={handleOpen}
              setConfirmEvent={setConfirmEvent}
            />
            <NewEvent
              loadModal={loadModal}
              setNewEvent={setNewEvent}
              newEvent={newEvent}
              handleClose={handleClose}
              initItem={initItem}
              isError={isError}
              handleDescription={handleDescription}
              createEvent={createEvent}
              setNewDateField={setNewDateField}
              confirmEvent={confirmEvent}
              setNewTextField={setNewTextField}
              setConfirmEvent={setConfirmEvent}
            />
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title={"Click to add new event"} followCursor>
              <Button variant={"outlined"} onClick={initEvent}>
                Add new event
              </Button>
            </Tooltip>
          </Box>
        </Box>
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
    )
  }
}
export default MyCalendar;