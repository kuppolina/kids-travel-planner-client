import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import "styles/views/UpdateTrip.scss";
import BaseContainer from "components/ui/BaseContainer";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import organizerProfile from "assets/Kadie.jpeg";
import Trip from "models/Organizer";
import PropTypes from "prop-types";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const TripItem = ({ trip, status, handleTripStatusChange }) => (
  <div className="update-trip info-row">
    <div className="update-trip info-label-name"> {trip.title}</div>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={[
        { label: 'DRAFT' },
        { label: 'FINISHED' },
        { label: 'STARTED' },
      ]}
      value={{ label: status }}
      onChange={handleTripStatusChange}
      sx={{ width: 300, '& .MuiInputBase-input': { fontSize: 12 }, '& .MuiAutocomplete-endAdornment': { top: 'calc(50% - 10px)' } }}
      renderInput={(params) => <TextField {...params} label="Trip Status" />}
    />
  </div>
);

TripItem.propTypes = {
  trip: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  handleTripStatusChange: PropTypes.func.isRequired,
};

const Kid = ({ participants }) => (
  <div>
    <ul className="update-trip note-list">
      {Array.isArray(participants) && participants.map((participant) => (
        <li key={participant.id} className="update-trip note-item">
          <p>{participant.name}</p>
        </li>
      ))}
    </ul>
  </div>
);

Kid.propTypes = {
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const UpdateTrip: React.FC = () => {
  const navigate = useNavigate();

  const [loggedInOrganizerId, setLoggedInOrganizerId] = useState(localStorage.getItem("loggedInOrganizerId"));
  const [loggedInOrganizerUsername, setLoggedInOrganizerUsername] = useState(localStorage.getItem("loggedInOrganizerUsername"));
  const { tripId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));

  const [trip, setTrip] = useState<Trip | null>(null);
  const [description, setDescription] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const goBack = () => {
    navigate(-1);
  };

  const openMyGroup = () => {
    navigate(`/planner/organizers/${loggedInOrganizerId}/participants`, { state: { organizerId: loggedInOrganizerId } });
  };

  const openHistory = () => {
    navigate(`/planner/organizers/${loggedInOrganizerId}/history`, { state: { organizerId: loggedInOrganizerId } });
  };

  const openEvents = () => {
    navigate(`/planner/events`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (loggedInOrganizerId) {
          const response = await api.get(`/organizers/${loggedInOrganizerId}/trips/${tripId}`);
          const fetchedTrip = new Trip(response.data);
          setTrip(fetchedTrip);
          setAddress(fetchedTrip.address);
          setDescription(fetchedTrip.description);
          setStatus(fetchedTrip.status);

          const participantsResponse = await api.get(`/trips/${tripId}/participants`);
          setParticipants(participantsResponse.data);
        }
      } catch (error) {
        console.error(`Something went wrong while fetching the trip: \n${handleError(error)}`);
        alert("Something went wrong while fetching the trip! See the console for details.");
      }
    }

    fetchData();
  }, [loggedInOrganizerId, tripId]);

  const saveChanges = async () => {
    try {
      if (tripId) {
        const requestBody = JSON.stringify({ address, description, status });
        await api.put(`/trips/${tripId}/update`, requestBody);
        navigate(-1);
      }
    } catch (error) {
      console.error(`Something went wrong while saving the trip info: \n${handleError(error)}`);
    }
  };

  const handleTripStatusChange = (event, value) => {
    if (value) {
      setStatus(value.label);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInOrganizerUsername");
    localStorage.removeItem("loggedInOrganizerId");
    localStorage.removeItem("loggedInOrganizerPhoto");
    navigate("/login");
  };

  let tripParticipants;

  if (Array.isArray(participants) && participants.length > 0) {
    tripParticipants = (
      <div>
        <BaseContainer>
          <Kid participants={participants} />
        </BaseContainer>
      </div>
    );
  } else {
    tripParticipants = "No participants yet .. ";
  }

  return (
    <div>
      <Header />
      <div className="update-trip parent">
        <BaseContainer className="update-trip info-container">
          <img className="update-trip organizer-photo" src={organizerProfile} alt="profile" />
          <h2 className="update-trip organizer-name">{loggedInOrganizerUsername}</h2>
          <h2 className="update-trip navigation" onClick={openMyGroup}>My Group</h2>
          <h2 className="update-trip navigation" onClick={openHistory}>Trip History</h2>
          <div className="update-trip button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="update-trip icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="update-trip trip-container">
          <div className="update-trip upper-line">
            <div className="update-trip button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="update-trip icon" />
              <p>Update Trip</p>
            </div>
            <div className="update-trip user-icons">
              <button className="save-button" onClick={saveChanges}>
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </div>
          <div className="update-trip content">
            {trip ? <TripItem trip={trip} status={status} handleTripStatusChange={handleTripStatusChange} /> : <p>Loading...</p>}
            <div className="update-trip item">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="participant-profile notes-tasks-container">
            <div className="participant-profile notes-header">
              <h2 className="participant-profile note-label">Participants</h2>
            </div>
            {tripParticipants}
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};

export default UpdateTrip;