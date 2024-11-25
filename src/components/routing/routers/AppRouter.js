import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { PlannerGuard } from "../routeProtectors/PlannerGuard";
import PlannerRouter from "./PlannerRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import MyParticipants from "../../views/MyParticipants";
import Registration from "../../views/Registration";
import AddParticipant from "../../views/AddParticipant";
import OrganizerProfile from "../../views/OrganizerProfile";
import ParticipantProfile from "../../views/ParticipantProfile";
import UpdateOrganizer from "../../views/UpdateOrganizer";
import UpdateParticipant from "../../views/UpdateParticipant";
import Trip from "../../views/Trip";
import UpdateTrip from "../../views/UpdateTrip";
import AddTrip from "../../views/AddTrip";
import History from "../../views/History";
import Events from "../../views/Events";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/planner/*" element={<PlannerGuard />}>
          <Route path="/planner/*" element={<PlannerRouter base="/planner" />} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/planner/organizers/:organizerId/participants" element={<PlannerGuard />}>
          <Route path="/planner/organizers/:organizerId/participants" element={<MyParticipants />} />
        </Route>

        <Route path="/registration" element={<LoginGuard />}>
          <Route path="/registration" element={<Registration />} />
        </Route>

        <Route path="/planner/participants" element={<PlannerGuard />}>
          <Route path="/planner/participants" element={<AddParticipant />} />
        </Route>

        <Route path="/planner/organizers/:organizerId" element={<PlannerGuard />}>
          <Route path="/planner/organizers/:organizerId" element={<OrganizerProfile />} />
        </Route>

        <Route path="/planner/participants/:participantId" element={<PlannerGuard />}>
          <Route path="/planner/participants/:participantId" element={<ParticipantProfile />} />
        </Route>

        <Route path="/planner/organizers/:organizerId/update" element={<PlannerGuard />}>
          <Route path="/planner/organizers/:organizerId/update" element={<UpdateOrganizer />} />
        </Route>

        <Route path="/planner/organizers/:organizerId/participants/:participantId/update" element={<PlannerGuard />}>
          <Route path="/planner/organizers/:organizerId/participants/:participantId/update" element={<UpdateParticipant />} />
        </Route>

        <Route path="/planner/organizers/:organizerId/history" element={<PlannerGuard />}>
          <Route path="/planner/organizers/:organizerId/history" element={<History />} />
        </Route>

        <Route path="/events" element={<PlannerGuard />}>
          <Route path="/events" element={<Events />} />
        </Route>

        <Route path="/planner/trips" element={<PlannerGuard />}>
          <Route path="/planner/trips" element={<AddTrip />} />
        </Route>

        <Route path="/planner/trips/:tripId" element={<PlannerGuard />}>
          <Route path="/planner/trips/:tripId" element={<Trip />} />
        </Route>

        <Route path="/planner/trips/:tripId/update" element={<PlannerGuard />}>
          <Route path="/planner/trips/:tripId/update" element={<UpdateTrip />} />
        </Route>

        <Route path="/" element={<Navigate to="/planner" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
