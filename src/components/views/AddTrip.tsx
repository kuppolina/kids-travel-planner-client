import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/AddTrip.scss";
import BaseContainer from "components/ui/BaseContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import { api, handleError } from "helpers/api";
import Trip from "models/Trip";
import organizerProfile from "assets/Kadie.jpeg";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import IconButton from '@mui/material/IconButton';

const AddTrip = () => {
  const navigate = useNavigate();
  const loggedInOrganizerId = localStorage.getItem("loggedInOrganizerId");
  const loggedInOrganizerUsername = localStorage.getItem("loggedInOrganizerUsername");
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));

  const [tripId, setTripId] = useState(null);
  const [title, setTitle] = useState("");
  const [numberOfKids, setNumberOfKids] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [checklist, setChecklist] = useState("");
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
      const organizerId = loggedInOrganizerId;
      const requestBody = JSON.stringify({ title, numberOfKids, address, description, image, organizerId});
      const response = await api.post("/trips", requestBody);

      const trip = new Trip(response.data);
      navigate(`/planner/trips/${trip.id}`);
    } catch (error) {
      alert(`Something went wrong during the trip creation: \n${handleError(error)}`);
    }
  };

  const handleDiscard = () => {
    setTitle("");
    setNumberOfKids("");
    setAddress("");
    setDescription("");
    setChecklist("");
    setImage("");
  };

  useEffect(() => {
    async function fetchData() {
      // fetch data if needed
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
    return title && numberOfKids && address && description;
  };

  return (
    <div>
      <Header />
      <div className="create-trip parent">
        <BaseContainer className="create-trip info-container">
          <img src={organizerProfile} className="create-trip organizer-photo" alt="profile" />
          <h2 className="organizer-profile organizer-name">{loggedInOrganizerUsername}</h2>
          <h2 className="organizer-profile navigation" onClick={openMyGroup}>My Group</h2>
          <h2 className="organizer-profile navigation" onClick={openHistory}>Trip History</h2>
          <div className="organizer-profile button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="organizer-profile icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="create-trip add-container">
          <div className="create-trip upper-line">
            <div className="create-trip button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="create-trip icon" />
              <p>Create Trip</p>
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
          <form className="create-trip form">
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>Number of kids</label>
            <input type="number" value={numberOfKids} onChange={(e) => setNumberOfKids(e.target.value)} />
            <label>Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="create-trip button-container">
              <button type="button" onClick={handleDiscard}>Discard</button>
              <button type="button" onClick={handleSave} disabled={!isFormValid()}>Save</button>
            </div>
          </form>
        </BaseContainer>
      </div>
    </div>
  );
};

export default AddTrip;
