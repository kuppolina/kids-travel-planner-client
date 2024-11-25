import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "styles/views/UpdateOrganizer.scss";
import BaseContainer from "components/ui/BaseContainer";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import organizerProfile from "assets/Kadie.jpeg";
import Organizer from "models/Organizer";

const UpdateOrganizer: React.FC = () => {
  const navigate = useNavigate();

  const [loggedInOrganizerId, setLoggedInOrganizerId] = useState(localStorage.getItem("loggedInOrganizerId"));
  const [loggedInOrganizerUsername, setLoggedInOrganizerUsername] = useState(localStorage.getItem("loggedInOrganizerUsername"));
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));

  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");

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
          const response = await api.get(`/organizers/${loggedInOrganizerId}`);
          const fetchedOrganizer = new Organizer(response.data);
          setOrganizer(fetchedOrganizer);
          setName(fetchedOrganizer.name);
          setAddress(fetchedOrganizer.address);
          setEmail(fetchedOrganizer.email);
        }
      } catch (error) {
        console.error(`Something went wrong while fetching the organizer: \n${handleError(error)}`);
        alert("Something went wrong while fetching the organizer! See the console for details.");
      }
    }

    fetchData();
  }, [loggedInOrganizerId]);

  const saveChanges = async () => {
    try {
      if (loggedInOrganizerId) {
        const requestBody = JSON.stringify({ address, email, name });
        await api.put(`/organizers/${loggedInOrganizerId}/update`, requestBody);
        navigate(-1);
      }
    } catch (error) {
      console.error(`Something went wrong while saving the organizer info: \n${handleError(error)}`);
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
      <div className="edit-organizer-profile parent">
        <BaseContainer className="edit-organizer-profile info-container">
          <img className="edit-organizer-profile organizer-photo" src={organizerProfile} alt="profile" />
          <h2 className="edit-organizer-profile organizer-name">{loggedInOrganizerUsername}</h2>
          <h2 className="edit-organizer-profile navigation" onClick={openMyGroup}>My Group</h2>
          <h2 className="edit-organizer-profile navigation" onClick={openHistory}>Trip History</h2>
          <div className="edit-organizer-profile button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="edit-organizer-profile icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="edit-organizer-profile organizer-container">
          <div className="edit-organizer-profile upper-line">
            <div className="edit-organizer-profile button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="edit-organizer-profile icon" />
              <p>My Profile</p>
            </div>
            <div className="edit-organizer-profile user-icons">
              <button className="save-button" onClick={saveChanges}>
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </div>
          <div className="edit-organizer-profile content">
            <div className="edit-organizer-profile item">
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="edit-organizer-profile item">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="edit-organizer-profile item">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="edit-organizer-profile notes-tasks-container">
            <h2 className="edit-organizer-profile note-label">Notes</h2>
            <ul className="edit-organizer-profile note-list">
              {Array.isArray(organizer?.notes) && organizer.notes.length > 0 ? (
                organizer.notes.map((note) => (
                  <li key={note.id} className="edit-organizer-profile note-item">
                    <p>{note.content}</p>
                  </li>
                ))
              ) : (
                <li>No notes yet ..</li>
              )}
            </ul>
          </div>
          <div className="edit-organizer-profile notes-tasks-container">
            <h2 className="edit-organizer-profile note-label">Tasks</h2>
            <ul className="edit-organizer-profile note-list">
              {Array.isArray(organizer?.tasks) && organizer.tasks.length > 0 ? (
                organizer.tasks.map((task) => (
                  <li key={task.id} className="edit-organizer-profile note-item">
                    <p>{task.content}</p>
                  </li>
                ))
              ) : (
                <li>No tasks yet ..</li>
              )}
            </ul>
          </div>
        </BaseContainer>
      </div>
    </div>
  );
};

export default UpdateOrganizer;