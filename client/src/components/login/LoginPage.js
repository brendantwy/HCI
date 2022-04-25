import React, { useState, useEffect,useContext, createContext } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import { BrowserRouter as Route, Redirect } from "react-router-dom";

const style2 = {
  position: "absolute",
  top: "53%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function LoginPage() {

  const [user, setUser] = useState([]); //initialize val of users[]
  const [password, setPassword] = useState([]);
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [id,setId] = useState("");

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      buttonSubmit();
    }
  }
  const buttonSubmit = async (event) => {
    setUser();
    setPassword();
    await axios.post("/login", [user, password]).then((response) => {
      changeLoggedIn(response.data.employeeId);
      localStorage.setItem("employeeId", response.data.employeeId);
      // window.location.reload(true);
    });
  };

  const changeLoggedIn = (id) => {
    setId(id);
    return setLoggedIn(true);
  };
  const updateId = (event) => {
    const userName = event.target.value;
    setUser({ user: userName });

    if (userName === "hello") {
      setError1(true);
    } else {
      setError1(false);
    }
  };

  const updatePassword = (event) => {
    const password = event.target.value;
    setPassword({ password: password });

    if (password === "test") {
      setError2(true);
    } else {
      setError2(false);
    }
  };


  return (
    <Card sx={{ ...style2, minWidth: 350, minHeight: 300 }}>
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" marginRight="50">
          Email Address
        </Typography>

        {error1 === false ? (
          <TextField
            id="outlined-basic"
            label="Please enter email address"
            variant="outlined"
            onInput={updateId}
          />
        ) : (
          <TextField
            error
            id="outlined-error"
            onChange={updateId}
            helperText="*Required"
          />
        )}
      </CardContent>

      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h5"> Password </Typography>

        {error2 === false ? (
          <TextField
            id="outlined-basic"
            label="Please enter password"
            variant="outlined"
            type="password"
            onInput={updatePassword}
            onKeyDown={handleEnter}
          />
        ) : (
          <TextField
            error
            id="outlined-error"
            onChange={updatePassword}
            type="password"
            helperText="*Required"
          />
        )}
      </CardContent>

      <CardContent sx={{ float: "right" }}>
        <Button variant="outlined" onClick={buttonSubmit} >
          Login
        </Button>
      </CardContent>

      {loggedIn === true ? <Redirect to={{pathname:'/home',state:{userId:id}}}></Redirect> : null}
    </Card>
  );
}
