import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import "styles/views/UpdateParticipant.scss";
import BaseContainer from "components/ui/BaseContainer";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import organizerProfile from "assets/Kadie.jpeg";
import Participant from "models/Participant";

const UpdateParticipant: React.FC = () => {
  const navigate = useNavigate();

  const [loggedInOrganizerId, setLoggedInOrganizerId] = useState(localStorage.getItem("loggedInOrganizerId"));
  const [loggedInOrganizerUsername, setLoggedInOrganizerUsername] = useState(localStorage.getItem("loggedInOrganizerUsername"));
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));

  const { participantId } = useParams();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [preferences, setPreferences] = useState<string>("");

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
        if (loggedInOrganizerId && participantId) {
          const response = await api.get(`/organizers/${loggedInOrganizerId}/participants/${participantId}`);
          const fetchedParticipant = new Participant(response.data);
          setParticipant(fetchedParticipant);
          setDateOfBirth(fetchedParticipant.dateOfBirth || new Date().toISOString().split('T')[0]);
          setAddress(fetchedParticipant.address);
          setPreferences(fetchedParticipant.notes);
        }
      } catch (error) {
        console.error(`Something went wrong while fetching the participant: \n${handleError(error)}`);
        alert("Something went wrong while fetching the participant! See the console for details.");
      }
    }

    fetchData();
  }, [loggedInOrganizerId, participantId]);

  const saveChanges = async () => {
    try {
      if (loggedInOrganizerId) {
        const notes = preferences;
        const requestBody = JSON.stringify({ address, notes, dateOfBirth });
        await api.put(`/participants/${participantId}/update`, requestBody);
        navigate(-1);
      }
    } catch (error) {
      console.error(`Something went wrong while saving the participant info: \n${handleError(error)}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInOrganizerUsername");
    localStorage.removeItem("loggedInOrganizerId");
    localStorage.removeItem("loggedInOrganizerPhoto");
    navigate("/login");
  };

  return (
    <div>
      <Header />
      <div className="edit-participant-profile parent">
        <BaseContainer className="edit-participant-profile info-container">
          <img className="edit-participant-profile organizer-photo" src={organizerProfile} alt="profile" />
          <h2 className="edit-participant-profile organizer-name">{loggedInOrganizerUsername}</h2>
          <h2 className="edit-participant-profile navigation" onClick={openMyGroup}>My Group</h2>
          <h2 className="edit-participant-profile navigation" onClick={openHistory}>Trip History</h2>
          <div className="edit-participant-profile button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="edit-participant-profile icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="edit-participant-profile organizer-container">
          <div className="edit-participant-profile upper-line">
            <div className="edit-participant-profile button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="edit-participant-profile icon" />
              <p>My Profile</p>
            </div>
            <div className="edit-participant-profile user-icons">
              <button className="save-button" onClick={saveChanges}>
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </div>
          <div className="edit-participant-profile content">
            <div className="edit-participant-profile item">
              <label>Birthday:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="edit-participant-profile item">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="edit-participant-profile item">
              <label>Preferences:</label>
              <input
                type="text"
                name="preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />
            </div>
          </div>
          <div className="edit-participant-profile notes-tasks-container">
            <h2 className="edit-participant-profile note-label">Notes</h2>
            <ul className="edit-participant-profile note-list">
              {Array.isArray(participant?.kidNotes) && participant.kidNotes.length > 0 ? (
                participant.kidNotes.map((kidNote) => (
                  <li key={kidNote.id} className="edit-participant-profile note-item">
                    <p>{kidNote.content}</p>
                  </li>
                ))
              ) : (
                <li>No notes yet ..</li>
              )}
            </ul>
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};

export default UpdateParticipant;
