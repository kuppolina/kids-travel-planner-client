import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";


export const PlannerGuard = () => {
  if (localStorage.getItem("token")) {
    
    return <Outlet />;
  }
  
  return <Navigate to="/login" replace />;
};

PlannerGuard.propTypes = {
  children: PropTypes.node
};