import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import "styles/views/Trip.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import organizerProfile from "assets/Kadie.jpeg";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

const TripItem = ({ trip }) => (
  <div className="trip container">
    <div className="trip info-label-name"> {trip.title}</div>
    <div className="trip info-label">Address: {trip.address}</div>
    <div className="trip info-label">Status: {trip.status}</div>
    <div className="trip info-label">Number of Kids: {trip.numberOfKids}</div>
  </div>
);

const Description = ({ trip }) => (
  <div className="trip container">
    <div className="trip description"> {trip.description}</div>
  </div>
);

TripItem.propTypes = {
  trip: PropTypes.object.isRequired,
};

Description.propTypes = {
  trip: PropTypes.object.isRequired,
};

const Trip = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [open, setOpen] = useState(false);
  const { tripId } = useParams();

  const loggedInOrganizerId = localStorage.getItem("loggedInOrganizerId");
  const loggedInOrganizerUsername = localStorage.getItem("loggedInOrganizerUsername");
  const loggedInOrganizerPhoto = localStorage.getItem("loggedInOrganizerPhoto");

  const doDraftUpdate = () => {
    navigate(`/planner/trips/${trip.id}/update`, { state: { tripId: tripId } });
  };

  const doTripDelete = async () => {
    try {
      await api.delete(`/organizers/${loggedInOrganizerId}/trips/${tripId}`);
      navigate(-1); // Go back after deletion
    } catch (error) {
      console.error(`Failed to delete the trip: \n${handleError(error)}`);
      alert("Failed to delete the trip! See the console for details.");
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleParticipantChange = (participantId) => {
    setSelectedParticipants((prevSelected) =>
      prevSelected.includes(participantId)
        ? prevSelected.filter((id) => id !== participantId)
        : [...prevSelected, participantId]
    );
  };

  const saveParticipants = async () => {
    console.log("saveParticipants called");
    console.log("Selected Participants:", selectedParticipants);
    try {
      const response = await api.post(`/trips/${tripId}/participants`, selectedParticipants.map(id => ({ id })));
      console.log("Response from server:", response);

      // Fetch and update participants after saving
      const updatedParticipantsResponse = await api.get(`/trips/${tripId}/participants`);
      setSelectedParticipants(updatedParticipantsResponse.data.map(p => p.id));
      handleClose();
    } catch (error) {
      console.error(`Failed to save participants: \n${handleError(error)}`);
      alert("Failed to save participants! See the console for details.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInOrganizerUsername");
    localStorage.removeItem("loggedInOrganizerId");
    localStorage.removeItem("loggedInOrganizerPhoto");
    navigate("/login");
  };

  const goBack = () => {
    navigate(-1);
  };

  const openMyGroup = () => {
    navigate(`/planner/organizers/${loggedInOrganizerId}/participants`, { state: { organizerId: loggedInOrganizerId } });
  };

  const openHistory = () => {
    navigate(`/planner/organizers/${loggedInOrganizerId}/history`, { state: { organizerId: loggedInOrganizerId } });
  };

  const openMyProfile = () => {
    navigate(`/planner/organizers/${loggedInOrganizerId}`, { state: { organizerId: loggedInOrganizerId } });
  };

  const openEvents = () => {
    navigate(`/planner/events`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (loggedInOrganizerId && tripId) {
          const tripResponse = await api.get(`/organizers/${loggedInOrganizerId}/trips/${tripId}`);
          setTrip(tripResponse.data);

          const participantsResponse = await api.get(`/organizers/${loggedInOrganizerId}/participants`);
          setParticipants(participantsResponse.data);
          console.log(participantsResponse.data);

          const selectedParticipantsResponse = await api.get(`/trips/${tripId}/participants`);
          setSelectedParticipants(selectedParticipantsResponse.data.map(p => p.id));
          console.log(selectedParticipantsResponse.data);
        }
      } catch (error) {
        console.error(`Something went wrong while fetching data: \n${handleError(error)}`);
        alert("Something went wrong while fetching data! See the console for details.");
      }
    }

    fetchData();
  }, [tripId, loggedInOrganizerId]);

  return (
    <div>
      <Header />
      <div className="trip parent">
        <BaseContainer className="trip info-container">
          <img className="trip organizer-photo" src={organizerProfile} alt="profile" />
          <h2 className="trip organizer-name">{loggedInOrganizerUsername}</h2>
          <h2 className="trip navigation" onClick={openMyGroup}>My Group</h2>
          <h2 className="trip navigation" onClick={openHistory}>Trip History</h2>
          <div className="trip button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="trip icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="trip organizer-container">
          <div className="trip upper-line">
            <div className="trip button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="trip icon" />
              <p>My Trip</p>
            </div>
            <div className="trip user-icons">
              <IconButton aria-label="update" size="large" onClick={doDraftUpdate}>
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="delete" size="large" onClick={doTripDelete}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </div>
          </div>
          <div className="trip content">
            {trip ? <TripItem trip={trip} /> : <p>Loading...</p>}
          </div>
          <div className="trip description-container">
            <h2 className="trip note-label">Description</h2>
            {trip && trip.description ? (
              <Description trip={trip} />
            ) : (
              <p>No description available.</p>
            )}
          </div>
          <div className="trip description-container">
            <div className="trip header">
              <h2 className="trip container-label">Participants</h2>
              <IconButton aria-label="add" size="large" className="organizer-profile add-button" onClick={handleOpen}>
                <AddCircleOutlineIcon fontSize="inherit" />
              </IconButton>
            </div>
            <div>
              {participants.filter(p => selectedParticipants.includes(p.id)).map(participant => (
                <div key={participant.id}>{participant.name}</div>
              ))}
            </div>
          </div>
        </BaseContainer>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxHeight: '80%', // Limit maximum height to 80% of the viewport
            overflowY: 'auto', // Enable vertical scrolling
          }}
        >
          <h2 id="modal-title">Select Participants</h2>
          <div id="modal-description" 
          style={{ 
            maxHeight: '200px',
            overflowY: 'auto',
            display: 'flex', 
            flexDirection: 'column' 
            }} 
            >
            {participants.map((participant) => (
              <FormControlLabel
                key={participant.id}
                control={
                  <Checkbox
                    checked={selectedParticipants.includes(participant.id)}
                    onChange={() => handleParticipantChange(participant.id)}
                    name={participant.name}
                    style={{ marginBottom: '8px'}} // Space out items
                  />
                }
                label={participant.name}
              />
            ))}
          </div>
          <Button onClick={saveParticipants} variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Trip;