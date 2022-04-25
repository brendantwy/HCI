import * as React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, ListItemButton, Avatar, Typography, Button, Box, Chip, Tooltip } from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import SensorDoorIcon from '@mui/icons-material/SensorDoor';
import EventIcon from '@mui/icons-material/Event';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { homeCard, homeList } from '../../Styles';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0]}`,
  };
}

function iconType(cardType) {
  if (cardType === 'Leaves') { return <SensorDoorIcon fontSize={'large'} color={'primary'} /> }
  else if (cardType === 'Claims') { return <AccountBalanceWalletIcon fontSize={'large'} color={'primary'} /> }
  else if (cardType === 'Calendar') { return <EventIcon fontSize={'large'} color={'primary'} /> }
  else if (cardType === 'Sick leave') { return <MedicalServicesIcon /> }
  else if (cardType === 'Vacation') { return <BeachAccessIcon /> }
  else if (cardType === 'Medical') { return <LocalHospitalIcon /> }
  else if (cardType === 'Dental') { return <LocalHospitalIcon /> }
}

function getChip(statusType) {
  if (statusType === 'APPROVED') return <Chip variant="outlined" label="APPPROVED" color="success" />;
  if (statusType === 'PENDING') return <Chip variant="outlined" label="PENDING" color="warning" />;
  if (statusType === 'REJECTED') return <Chip variant="outlined" label="REJECTED" color="error" />;
}

function formatDate(start, end) {
  var startDate = new Date(start);
  var endDate = new Date(end);
  return startDate.toDateString() + ' - ' + endDate.toDateString()

}

function renderListItem(dataTable, cardType, navigateTo) {

  var totalItemList = [];
  if (dataTable.length > 2) {
    dataTable.length = 2;
    console.log('datatable length!' + dataTable.length);
  }
  if (cardType === 'Leaves' && dataTable.length != 0) {
    console.log('listItem in leaves');
    console.log(dataTable)
    for (var i = 0; i < dataTable.length; i++) {
      totalItemList.push(
        <Tooltip title={"Click to preview!"} followCursor>
          <ListItem>
            <ListItemButton onClick={() => { navigateTo(cardType) }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'lightblue' }}>
                  {iconType(dataTable[i].leaves_type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={dataTable[i].leaves_type} secondary={formatDate(dataTable[i].leaves_start_date, dataTable[i].leaves_end_date)} />
              {getChip(dataTable[i].leaves_status)}
            </ListItemButton>
          </ListItem>
        </Tooltip>

      )
    }

  }
  else if (cardType === 'Claims' && dataTable.length != 0) {
    console.log('listItem in Claims');
    console.log(dataTable)
    for (var i = 0; i < dataTable.length; i++) {
      totalItemList.push(
        <Tooltip title={"Click to preview!"} followCursor>
          <ListItem>
            <ListItemButton onClick={() => { navigateTo(cardType) }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'green' }}>
                  {iconType(dataTable[i].claims_type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={dataTable[i].claims_type} secondary={dataTable[i].claims_remark} />
              {getChip(dataTable[i].claims_status)}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      )
    }

  }
  else if (cardType === 'Calendar' && dataTable.length != 0) {
    console.log('listItem in Calendar');
    console.log(dataTable)
    for (var i = 0; i < dataTable.length; i++) {
      totalItemList.push(
        <Tooltip title={"Click to preview!"} followCursor>
          <ListItem>
            <ListItemButton onClick={() => { navigateTo(cardType) }} >
              <ListItemAvatar>
                <Avatar {...stringAvatar(dataTable[i].name)} />
              </ListItemAvatar>
              <ListItemText primary={dataTable[i].title} secondary={formatDate(dataTable[i].start, dataTable[i].end)} />
            </ListItemButton>
          </ListItem>
        </Tooltip>
      )
    }
  }
  else {
    totalItemList.push(

      <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
        <Typography variant={'h5'}>No Record Found!</Typography>
      </Box>

    )
  }
  return totalItemList;

}
export default function CardList(props) {
  const { cardType, dataTable, navigateTo } = props;

  return (
    <Box sx={homeCard}>
      <Box sx={{ justifyContent: 'center', display: 'flex' }}>
        {iconType(cardType)}
        <Typography variant='h3' >
          {cardType}
        </Typography>
      </Box>
      <Box sx={homeList}>
        {cardType === 'Calendar' ? <Box sx={{ justifyContent: 'center', display: 'flex' }}>
          <Typography>Events for the next 7 Days</Typography></Box> : null}
        <List sx={{ width: '100%', }}>

          {renderListItem(dataTable, cardType, navigateTo)}
        </List>
        <Box sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
          <Tooltip title={"Click to access " + cardType} followCursor>
            <Button variant={'outlined'} onClick={() => { navigateTo(cardType) }}>Access {cardType} Page</Button>
          </Tooltip>
        </Box>
      </Box>

    </Box>
  );
}