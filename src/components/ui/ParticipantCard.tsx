import React from "react";
import PropTypes from 'prop-types';
import "../../styles/ui/ParticipantCard.scss";

const ParticipantCard = ({ image, name, age, onClick }) => {
  return (
    <div className="participant-card" onClick={onClick}>
      <img src={image} alt={name} className="participant-card-image" />
      <h2 className="participant-card-name">{name}</h2>
      <h2 className="participant-age">{age} y.o.</h2>
    </div>
  );
};

ParticipantCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired,
  onClick: PropTypes.func, 
};

export default ParticipantCard;