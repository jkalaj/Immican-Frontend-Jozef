import React, { useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { getSingleData } from "../../api/FetchData";
import ViewProfileModal from "../dashboard/pages/myStory/ViewProfileModal";

const localizer = momentLocalizer(moment);


function Event({ event, handleViewOptionsClick }) {
  return (
    <Grid container spacing={4}>
      <Grid item md={3}>
        <Avatar onClick={()=>event.storyVideo !== ''?handleViewOptionsClick(event.storyVideo):null} alt={event.title}
                style={{border: event.storyVideo !== ''?'3px solid #ef5359': "unset"}}
                src={event.profilePicture !== ''? event.profilePicture:'/images/profile.png'} />
      </Grid>
      <Grid item md={9}>
        <p style={{margin: '10px 0px 0px 0px'}}>{event.title !== ' '?event.title: 'Request is not accepted yet'}</p>
        {/* You can access myEventsList here */}
      </Grid>
    </Grid>
  );
}
Event.propTypes = {
  event: PropTypes.object,
  myEventsList: PropTypes.array,
};

function EventAgenda({ event, handleViewOptionsClick }) {
  return (
    <Grid container spacing={4}>
      <Grid item md={1}>
        <Avatar onClick={()=>event.storyVideo !== ''?handleViewOptionsClick(event.storyVideo):null} alt={event.title}
                style={{border: event.storyVideo !== ''?'3px solid #ef5359': "unset", cursor: 'pointer'}}
                src={event.profilePicture !== ''? event.profilePicture:'/images/profile.png'} />
      </Grid>
      <Grid item md={9}>
        <p style={{margin: '10px 0px 0px 0px'}}>{event.title !== ' '?event.title: 'Request is not accepted yet'}</p>
        {/* You can access myEventsList here */}
      </Grid>
    </Grid>
  );
}
EventAgenda.propTypes = {
  event: PropTypes.object,
  myEventsList: PropTypes.array,
};

const MyCalendar = () => {
  const [myEventsList, setMyEventsList] = useState([]);
  const [showViewOptions, setShowViewOptions] = useState(false);
  const [videoLink, setVideoLink] = useState('');
  const handleViewOptionsClick = (video) => {
    setShowViewOptions(true);
    setVideoLink(video);
  };
  const handleCloseViewModal = () => {
    setShowViewOptions(false);
  };
  const { components, defaultDate } = useMemo(
    () => ({
      components: {
        agenda: {
          event: props => <EventAgenda {...props} handleViewOptionsClick={handleViewOptionsClick}/>,
        },
        event: props => <Event {...props} handleViewOptionsClick={handleViewOptionsClick} />,
      },
    }),
    [myEventsList]
  );

  const getMyUnimoDetails = async () => {
    let userToken = localStorage.getItem("access_token");
    return await getSingleData('myunimo/myUnimoCalendarDetails', '', userToken);
  };

  useEffect(() => {
    getMyUnimoDetails().then((data) => {
      console.log('data', data)
      setMyEventsList(data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <ViewProfileModal
        isOpen={showViewOptions}
        onClose={handleCloseViewModal}
        storySrc={videoLink}
        viewType='story'
      />
      <Calendar
        components={components}
        events={myEventsList}
        localizer={localizer}
        defaultView={Views.MONTH}
        style={{ height: '600px' }}
      />
    </div>
  );
};

export default MyCalendar;
