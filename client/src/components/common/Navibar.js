import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Grid, Typography, Button, IconButton, MenuIcon, Modal } from '@mui/material'
import BasicCard from '../profile/Home'
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { style2 } from '../../Styles';



export default function ButtonAppBar() {
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();
  function handleLogout() {
    localStorage.removeItem("employeeId");
    setOpenModal(false)
    history.push("/");
  }
  return (

    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" minWidth="500" >
        <Toolbar>

          <Link to="/Home" style={{ justifyContent: 'flex-start', textDecoration: 'none', color: '#FFF' }} class="nav-link" aria-current="page" href="#">
            Home
          </Link>
          <Link to="/Claims" style={{ justifyContent: 'flex-start', marginLeft: 10, textDecoration: 'none', color: '#FFF' }} class="nav-link" aria-current="page" href="#">
            Claim
          </Link>
          <Link to="/Leaves" style={{ justifyContent: 'flex-start', marginLeft: 10, textDecoration: 'none', color: '#FFF' }} class="nav-link" aria-current="page" href="#">
            Leaves
          </Link>
          <Link to="/Calendar" style={{ justifyContent: 'flex-start', marginLeft: 10, textDecoration: 'none', color: '#FFF' }} class="nav-link" aria-current="page" href="#">
            Calendar
          </Link>
          <Link to="/Profile" style={{ position: 'absolute', right: 80, textDecoration: 'none', color: '#FFF' }} class="nav-link" aria-current="page" href="#">
            Profile
          </Link>
          <Button style={{ position: 'absolute', right: 20, textDecoration: 'none', color: '#FFF' }} class="nav-link" aria-current="page" href="#"
            onClick={() => setOpenModal(true)} >Logout</Button>

        </Toolbar>
      </AppBar>
      <Modal
        open={openModal}
        onClose={()=>setOpenModal(false)}>
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
              <Typography variant="h5">Confirm Logout?</Typography>
            </Grid>
          
            <Grid item xs={4}>
              <Button onClick={() => setOpenModal(false)} variant={"outlined"}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                onClick={() => handleLogout()}
                variant={"outlined"}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}