import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Planner from "../../views/Planner";
import PropTypes from "prop-types";

const PlannerRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Planner />} />

        <Route path="dashboard" element={<Planner />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

      </Routes>
   
    </div>
  );
};

PlannerRouter.propTypes = {
  base: PropTypes.string
}

export default PlannerRouter;
