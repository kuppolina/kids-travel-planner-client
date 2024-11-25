import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "styles/views/MyParticipants.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Participant } from "types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import ParticipantCard from "components/ui/ParticipantCard";
import defaultParticipantImage from "assets/boy-photo.jpeg";
import organizerProfile from "assets/Kadie.jpeg";

const MyParticipants = () => {
  const navigate = useNavigate();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loggedInOrganizerId, setLoggedInOrganizerId] = useState(localStorage.getItem("loggedInOrganizerId"));
  const [loggedInOrganizerUsername, setLoggedInOrganizerUsername] = useState(localStorage.getItem("loggedInOrganizerUsername"));
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));
  const [searchQuery, setSearchQuery] = useState('');

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

  const openParticipant = (participantId) => {
    navigate(`/planner/participants/${participantId}`, { state: { participantId: participantId } });
  };

  const addParticipant = () => {
    navigate("/planner/participants");
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredParticipants = (participants || []).filter((participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchData() {
      try {
        if (loggedInOrganizerId) {
          console.log("loggedInOrganizerId: ", loggedInOrganizerId);
          const response = await api.get(`/organizers/${loggedInOrganizerId}/participants`);
          setParticipants(response.data);

          const organizerResponse = await api.get(`/organizers/${loggedInOrganizerId}`);
          const organizerData = organizerResponse.data;
          setLoggedInOrganizerPhoto(organizerData.photo);
          setLoggedInOrganizerUsername(organizerData.username);

          localStorage.setItem("loggedInOrganizerPhoto", organizerData.photo);
          localStorage.setItem("loggedInOrganizerUsername", organizerData.username);
        }
      } catch (error) {
        console.error(`Something went wrong while fetching the participants: \n${handleError(error)}`);
      }
    }

    fetchData();
  }, [loggedInOrganizerId]);

  return (
    <div>
      <Header />
      <div className="my-participants parent">
        <BaseContainer className="my-participants info-container">
          <img src={organizerProfile} className="my-participants organizer-photo" alt="profile-image" />
          <h2 className="my-participants organizer-name" onClick={openMyProfile}>{loggedInOrganizerUsername}</h2>
          <h2 className="my-participants navigation" onClick={openHistory}>Trip History</h2>
          <div className="my-participants button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="my-participants icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="my-participants participants-container">
          <div className="organizer-profile upper-line">
            <div className="organizer-profile button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="organizer-profile icon" />
              <p>My Group</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search participants"
            value={searchQuery}
            onChange={handleSearchChange}
            className="my-participants search-bar"
          />
          <ul className="my-participants participant-list">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant) => (
                <li key={participant.id} className="my-participants participant-item">
                  <ParticipantCard
                    image={participant.image ? `http://localhost:8080/photos/${participant.image}` : defaultParticipantImage}
                    name={participant.name}
                    age={participant.age}
                    onClick={() => openParticipant(participant.id)}
                  />
                </li>
              ))
            ) : (
              <li className="participant-item">
                <p className="no-participants">No participants available.</p>
              </li>
            )}
            <li className="my-participants participant-item add-participant-container">
              <div className="add-participant-card" onClick={addParticipant}>
                <FontAwesomeIcon className="my-participants plus-icon" icon={faPlus} />
              </div>
            </li>
          </ul>
        </BaseContainer>
      </div>
    </div>
  );
};

export default MyParticipants;
