import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import Organizer from "models/Organizer";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Registration.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import loginImage from "assets/regist-1.jpg";

const FormField = (props) => {
  return (
    <div className="registration field">
      <label className="registration label">{props.label}</label>
      <input
        className="registration input"
        placeholder="registration here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(null);

  const doRegistration = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/organizers", requestBody);

      // Get the returned user and update a new object.
      const organizer = new Organizer(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", organizer.token);
      localStorage.setItem("loggedInOrganizerId", organizer.id);
      localStorage.setItem("loggedInOrganizerPhoto", organizer.image);
      
      navigate(`/planner/organizers/${organizer.id}/trips`);
    } catch (error) {
      alert(
        `Something went wrong during the registration: \n${handleError(error)}`
      );
    }
  };

  const goBack = () => {
    navigate("/login");
  };

  return (
    <div className="registration container">
      <div className="registration form-container">
        <div className="registration form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(pw: string) => setPassword(pw)}
          />
          <div className="registration button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={doRegistration}
            >
              Register
            </Button>
          </div>
          <div className="registration button-container">
            <Button width="100%" onClick={goBack}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
      <div className="registration image-container">
        <img src={loginImage} alt="Login" className="registration image" />
      </div>
    </div>
  );
};

export default Registration;
