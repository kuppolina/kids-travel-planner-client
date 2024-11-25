import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Planner.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import defaultTripImage from "assets/log-in5.jpg";
import organizerProfile from "assets/Kadie.jpeg";
import TripCard from "components/ui/TripCard";

const Planner = () => {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loggedInOrganizerId, setLoggedInOrganizerId] = useState(localStorage.getItem("loggedInOrganizerId"));
  const [loggedInOrganizerUsername, setLoggedInOrganizerUsername] = useState(localStorage.getItem("loggedInOrganizerUsername"));
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));
  const [searchQuery, setSearchQuery] = useState('');

  let photoPath = "http://localhost:8080/photos/";
  let organizerPhotoPath = `${photoPath}${loggedInOrganizerPhoto}`;

  localStorage.setItem("loggedInOrganizerPhoto", organizerPhotoPath);

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

  const openTrip = (tripId) => {
    navigate(`/planner/trips/${tripId}`, { state: { tripId: tripId } });
  };

  const openEvents = () => {
    navigate(`/planner/events`);
  };

  const addTrip = () => {
    navigate(`/planner/trips`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTrips = (trips || []).filter((trip) =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchData() {
      try {
        if (loggedInOrganizerId) {
          const response = await api.get(`/organizers/${loggedInOrganizerId}/trips`);
          setTrips(response.data);

          const organizerResponse = await api.get(`/organizers/${loggedInOrganizerId}`);
          const organizerData = organizerResponse.data;
          setLoggedInOrganizerPhoto(organizerData.image);
          setLoggedInOrganizerUsername(organizerData.username);

          localStorage.setItem("loggedInOrganizerUsername", organizerData.username);
        }
      } catch (error) {
        console.error(`Something went wrong while fetching the trips: \n${handleError(error)}`);
      }
    }

    fetchData();
  }, [loggedInOrganizerId]);

  return (
    <div>
      <Header />
      <div className="planner parent">
        <BaseContainer className="planner info-container">
          <div className="planner photo-placeholder">
            <img src={organizerProfile} className="planner organizer-photo" alt="profile-image" />
          </div>
          <h2 className="planner organizer-name" onClick={openMyProfile}>{loggedInOrganizerUsername}</h2>
          <h2 className="planner navigation" onClick={openMyGroup}>My Group</h2>
          <h2 className="planner navigation" onClick={openHistory}>Trip History</h2>
          <div className="planner button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="planner icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="planner trips-container">
          <input
            type="text"
            placeholder="Search trips"
            value={searchQuery}
            onChange={handleSearchChange}
            className="planner search-bar"
          />
          <ul className="planner trip-list">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <li key={trip.id} className="planner trip-item">
                  <TripCard
                    image={trip.image ? `http://localhost:8080/photos/${trip.image}` : defaultTripImage}
                    title={trip.title}
                    status={trip.status}
                    onClick={() => openTrip(trip.id)}
                  />
                </li>
              ))
            ) : (
              <li className="trip-item">
                <p className="no-trips">No trips</p>
              </li>
            )}
            <li className="planner trip-item add-trip-container">
              <div className="add-trip-card" onClick={addTrip}>
                <FontAwesomeIcon className="planner plus-icon" icon={faPlus} />
              </div>
            </li>
          </ul>
        </BaseContainer>
      </div>
    </div>
  );
};

export default Planner;