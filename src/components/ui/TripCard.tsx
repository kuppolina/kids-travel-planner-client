import React from "react";
import PropTypes from 'prop-types';
import "../../styles/ui/TripCard.scss";

const TripCard = ({ image, title, status, onClick }) => {
  return (
    <div className="trip-card" onClick={onClick}>
      <img src={image} alt={title} className="trip-card-image" />
      <h3 className="trip-card-title">{title}</h3>
      <span className={`trip-status ${status.toLowerCase()}`}>{status}</span>
    </div>
  );
};

TripCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onClick: PropTypes.func, // Add onClick prop
};

export default TripCard;
