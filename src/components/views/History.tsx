import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/History.scss";
import { Trip } from "types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";
import TripCard from "components/ui/TripCard";
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import organizerProfile from "assets/Kadie.jpeg";
import defaultTripImage from "assets/log-in5.jpg";

const History = () => {
  const navigate = useNavigate();
  library.add(far);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loggedInOrganizerId, setLoggedInOrganizerId] = useState(null);
  const [loggedInOrganizerUsername, setLoggedInOrganizerUsername] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInOrganizerUsername");
    localStorage.removeItem("loggedInOrganizerId");
    navigate("/login");
  };

  const openMyGroup = () => {
    navigate(`/planner/organizers/${loggedInOrganizerId}/participants`, { state: { organizerId: loggedInOrganizerId } });

  }

  const goBack = () => {
    navigate(-1);

  }

  const openMyProfile = () => {
    navigate(`/planner/organizers/${loggedInOrganizerId}`, { state: { organizerId: loggedInOrganizerId } });
  }

  const openEvents = () => {
    navigate(`/planner/events`);

  }

  const openTrip = (tripId) => {
    navigate(`/planner/trips/${tripId}`, { state: { tripId: tripId } });
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTrips = (trips || []).filter((trip) =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function fetchData() {
      setLoggedInOrganizerId(localStorage.getItem("loggedInOrganizerId"));
      setLoggedInOrganizerUsername(localStorage.getItem("loggedInOrganizerUsername"));
      setLoggedInOrganizerPhoto(localStorage.getItem("loggedInOrganizerPhoto"))
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        if (loggedInOrganizerId) {
          const response = await api.get(`/organizers/${loggedInOrganizerId}/finishedtrips`);
          setTrips(response.data);
          console.log(response);
        }
      } catch (error) {
        console.error(`Something went wrong while fetching the finished trips: \n${handleError(error)}`);
        console.error("Details:", error);
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
          <div className="planner button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="planner icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="planner trips-container">
          <div className="participant-profile upper-line">
            <div className="participant-profile button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="participant-profile icon" />
              <p>Trip History</p>
            </div>
          </div>
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
          </ul>
        </BaseContainer>
      </div>
    </div>
  );
};

export default History;
