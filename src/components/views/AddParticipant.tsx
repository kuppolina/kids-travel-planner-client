import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/AddParticipant.scss";
import BaseContainer from "components/ui/BaseContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import { api, handleError } from "helpers/api";
import Participant from "models/Participant";
import organizerProfile from "assets/Kadie.jpeg";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import IconButton from '@mui/material/IconButton';

const AddParticipant = () => {
  const navigate = useNavigate();
  const loggedInOrganizerId = localStorage.getItem("loggedInOrganizerId");
  const loggedInOrganizerUsername = localStorage.getItem("loggedInOrganizerUsername");
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));
  
  const [participantId, setParticipantId] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("");

  const goBack = () => {
    navigate(-1);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file.name);
    } else {
      setImage("");
    }
  };

  const handleSave = async () => {
    try {
      console.log({
        image, name, age, dateOfBirth, address, notes, loggedInOrganizerId
        });
      const organizerId = loggedInOrganizerId;
      const requestBody = JSON.stringify({ name, age, dateOfBirth, address, notes, image, organizerId });
      const response = await api.post("/participants", requestBody);

      const participant = new Participant(response.data);
      setParticipantId(participant.id);
      navigate(`/planner/participants/${participant.id}`);
    } catch (error) {
      alert(`Something went wrong during the participant creation: \n${handleError(error)}`);
    }
  };

  const handleDiscard = () => {
    setName("");
    setAge("");
    setAddress("");
    setDateOfBirth("");
    setNotes("");
    setImage("");
  };

  useEffect(() => {
    async function fetchData() {
    
    }

    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInOrganizerUsername");
    localStorage.removeItem("loggedInOrganizerId");
    localStorage.removeItem("loggedInOrganizerPhoto");
    navigate("/login");
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

  const isFormValid = () => {
    return name && dateOfBirth && age && notes && address;
  };

  return (
    <div>
      <Header />
      <div className="create-participant parent">
        <BaseContainer className="create-participant info-container">
          <img src={organizerProfile} className="create-participant organizer-photo" alt="profile" />
          <h2 className="organizer-profile organizer-name">{loggedInOrganizerUsername}</h2>
          <h2 className="organizer-profile navigation" onClick={openMyGroup}>My Group</h2>
          <h2 className="organizer-profile navigation" onClick={openHistory}>Trip History</h2>
          <div className="organizer-profile button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="organizer-profile icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="create-participant add-container">
          <div className="create-participant upper-line">
            <div className="create-participant button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="create-participant icon" />
              <p>Create Participant</p>
            </div>
            <div className="trip user-icons">
              <label htmlFor="file-upload" className="custom-file-upload">
                <IconButton aria-label="upload" size="large" component="span">
                  <UploadFileIcon fontSize="inherit" />
                </IconButton>
              </label>
              <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              {image && <p>{image}</p>}
            </div>
          </div>
          <form className="create-participant form">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            <label>Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            <label>Date of birth</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            <label>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="create-participant button-container">
              <button type="button" onClick={handleDiscard}>Discard</button>
              <button type="button" onClick={handleSave} disabled={!isFormValid()}>Save</button>
            </div>
          </form>
        </BaseContainer>
      </div>
    </div>
  );
};

export default AddParticipant;
