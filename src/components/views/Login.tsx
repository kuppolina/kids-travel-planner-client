import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import Organizer from "models/Organizer";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import loginImage from "assets/log-in5.jpg";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);

      const organizer = new Organizer(response.data);
      localStorage.setItem("token", organizer.token);
      localStorage.setItem("loggedInOrganizerId", organizer.id);
      localStorage.setItem("loggedInOrganizerUsername", organizer.username);
      localStorage.setItem("loggedInOrganizerPhoto", organizer.image);

      navigate("/planner");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const register = (): void => {
    navigate("/registration");
  };

  return (
      <div className="login container">
        <div className="login form-container">
          <div className="login form">
            <FormField
              label="Username"
              value={username}
              onChange={(un: string) => setUsername(un)}
            />
            <FormField
              label="Password"
              value={password}
              onChange={(n) => setPassword(n)}
            />
            <div className="login button-container">
              <Button
                disabled={!username || !password}
                width="100%"
                onClick={() => doLogin()}
              >
                Login
              </Button>
              <Button width="100%" onClick={() => register()}>
                Register
              </Button>
            </div>
          </div>
        </div>
        <div className="login image-container">
          <img src={loginImage} alt="Login" className="login image" />
        </div>
      </div>
  );
};

export default Login;
