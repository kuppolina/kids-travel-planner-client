import React from 'react';
import PropTypes from 'prop-types';
import "../../styles/ui/AddCard.scss";

const AddTripCard = props => (
  <div {...props} className={`add-trip-card ${props.className ?? ""}`}>
    {props.children}
  </div>
);

AddTripCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default AddTripCard;