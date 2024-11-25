import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "styles/views/OrganizerProfile.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import organizerProfile from "assets/Kadie.jpeg";

const User = ({ organizer }) => (
  <div className="organizer-profile container">
    <div className="organizer-profile label-username"> {organizer.username}</div>
    <div className="organizer-profile name">Full Name: {organizer.name}</div>
    <div className="organizer-profile name">Address: {organizer.address}</div>
    <div className="organizer-profile name">Email: {organizer.email}</div>
  </div>
);

const Note = ({ notes }) => (
  <div className="organizer-profile container">
    <ul className="organizer-profile note-list">
      {notes.map((note) => (
        <li key={note.id} className="organizer-profile note-item">
          <p>{note.content}</p>
        </li>
      ))}
    </ul>
  </div>
);

const TaskItem = ({ tasks }) => (
  <div className="organizer-profile container">
    <ul className="organizer-profile task-list">
      {tasks.map((task) => (
        <li key={task.id} className="organizer-profile task-item">
          <p>{task.content}</p>
        </li>
      ))}
    </ul>
  </div>
);

User.propTypes = {
  organizer: PropTypes.object.isRequired,
};

Note.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

TaskItem.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const OrganizerProfile = () => {
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState(null);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  const loggedInOrganizerId = localStorage.getItem("loggedInOrganizerId");
  const [loggedInOrganizerUsername, setLoggedInOrganizerUsername] = useState(localStorage.getItem("loggedInOrganizerUsername"));
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));
  const [photoFile, setPhotoFile] = useState(null);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newTaskContent, setNewTaskContent] = useState('');

  const handleNoteOpen = () => {
    setNewNoteContent('');
    setNoteModalOpen(true);
  };
  const handleNoteClose = () => setNoteModalOpen(false);

  const handleTaskOpen = () => {
    setNewTaskContent('');
    setTaskModalOpen(true);
  };
  const handleTaskClose = () => setTaskModalOpen(false);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      alert("Note content cannot be empty!");
      return;
    }
    const newNote = {
      content: newNoteContent
    };
    try {
      await api.put(`/organizers/${loggedInOrganizerId}/updatenotes`, newNote);
      const response = await api.get(`/organizers/${loggedInOrganizerId}`);
      setNotes(response.data.notes);
      handleNoteClose();
    } catch (error) {
      console.error(`Failed to update notes: \n${handleError(error)}`);
      alert("Failed to update notes! See the console for details.");
    }
  };

  const handleAddTask = async () => {
    if (!newTaskContent.trim()) {
      alert("Task content cannot be empty!");
      return;
    }
    const newTask = {
      content: newTaskContent
    };
    try {
      console.log("newTask"+newTask.content);
      await api.put(`/organizers/${loggedInOrganizerId}/updatetasks`, newTask);
      const response = await api.get(`/organizers/${loggedInOrganizerId}`);
      setTasks(response.data.tasks);
      handleTaskClose();
    } catch (error) {
      console.error(`Failed to update tasks: \n${handleError(error)}`);
      alert("Failed to update tasks! See the console for details.");
    }
  };

  const emptyNotes = async () => {
    try {
      await api.delete(`/organizers/${loggedInOrganizerId}/emptynotes`);
      setNotes([]);
    } catch (error) {
      console.error(`Failed to empty notes: \n${handleError(error)}`);
      alert("Failed to empty notes! See the console for details.");
    }
  };

  const emptyTasks = async () => {
    try {
      await api.delete(`/organizers/${loggedInOrganizerId}/emptytasks`);
      setTasks([]);
    } catch (error) {
      console.error(`Failed to empty tasks: \n${handleError(error)}`);
      alert("Failed to empty tasks! See the console for details.");
    }
  };

  const doOrganizerUpdate = () => {
    navigate(`/planner/organizers/${loggedInOrganizerId}/update`, { state: { organizerId: loggedInOrganizerId } });
  };

  const doOrganizerDelete = async () => {
    try {
      await api.delete(`/organizers/${loggedInOrganizerId}`);
      navigate("/login"); 
    } catch (error) {
      console.error(`Failed to delete the organizer: \n${handleError(error)}`);
      alert("Failed to delete the organizer! See the console for details.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInOrganizerUsername");
    localStorage.removeItem("loggedInOrganizerId");
    localStorage.removeItem("loggedInOrganizerPhoto");
    navigate("/login");
  };

  const goBack = () => {
    navigate(-1);
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

  const openEvents = () => {
    navigate(`/planner/events`);
  };

  const handlePhotoUpload = () => {
    document.getElementById('photoInput').click();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoggedInOrganizerPhoto(reader.result);
      };
      reader.readAsDataURL(file);
      setPhotoFile(file);
      try {
        const formData = new FormData();
        formData.append('photo', file);
        const response = await api.put(`/organizers/${loggedInOrganizerId}/photo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Photo uploaded successfully:', response.data);
        const photoPath = response.data.photoPath;
        setLoggedInOrganizerPhoto(photoPath);
        localStorage.setItem("loggedInOrganizerPhoto", photoPath);
      } catch (error) {
        console.error('Failed to update photo:', error);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (loggedInOrganizerId) {
          const response = await api.get(`/organizers/${loggedInOrganizerId}`);
          setOrganizer(response.data);
          setNotes(response.data.notes || []);
          setTasks(response.data.tasks || []);
          setLoggedInOrganizerPhoto(response.data.image);
          setLoggedInOrganizerUsername(response.data.username);
        }
      } catch (error) {
        console.error(`Something went wrong while fetching the organizer: \n${handleError(error)}`);
        alert("Something went wrong while fetching the organizer! See the console for details.");
      }
    }

    fetchData();
  }, [loggedInOrganizerId]);

  let content;

  if (organizer) {
    content = (
      <div>
        <BaseContainer>
          <User organizer={organizer} />
        </BaseContainer>
      </div>
    );
  }

  let organizerNotes;

  if (notes.length > 0) {
    organizerNotes = (
      <div>
        <BaseContainer>
          <Note notes={notes} />
        </BaseContainer>
      </div>
    );
  } else {
    organizerNotes = "No notes yet .. ";
  }

  let organizerTasks;

  if (tasks.length > 0) {
    organizerTasks = (
      <div>
        <BaseContainer>
          <TaskItem tasks={tasks} />
        </BaseContainer>
      </div>
    );
  } else {
    organizerTasks = "No tasks yet .. ";
  }

  return (
    <div>
      <Header />
      <div className="organizer-profile parent">
        <BaseContainer className="organizer-profile info-container">
          <img className="organizer-profile organizer-photo"
            src={organizerProfile}
            alt="profile"
          />
          <input
            type="file"
            id="photoInput"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <h2 className="organizer-profile organizer-name">{loggedInOrganizerUsername}</h2>
          <h2 className="organizer-profile navigation" onClick={openMyGroup}>My Group</h2>
          <h2 className="organizer-profile navigation" onClick={openHistory}>Trip History</h2>
          <div className="organizer-profile button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="organizer-profile icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="organizer-profile organizer-container">
          <div className="organizer-profile upper-line">
            <div className="organizer-profile button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="organizer-profile icon" />
              <p>My Profile</p>
            </div>
            <div className="organizer-profile user-icons">
              <IconButton aria-label="update" size="large" onClick={doOrganizerUpdate}>
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="delete" size="large" onClick={doOrganizerDelete}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </div>
          </div>
          <div className="organizer-profile content">
            {content}
          </div>
          <div className="organizer-profile notes-tasks-container">
            <div className="organizer-profile notes-header">
              <h2 className="organizer-profile note-label">Notes</h2>
              <IconButton aria-label="add" size="large" className="organizer-profile add-button" onClick={handleNoteOpen}>
                <AddCircleOutlineIcon fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="add" size="large" className="organizer-profile add-button" onClick={emptyNotes}>
              <DeleteIcon fontSize="inherit" />
              </IconButton>
            </div>
            {organizerNotes}
          </div>
          <div className="organizer-profile notes-tasks-container">
            <div className="organizer-profile notes-header">
              <h2 className="organizer-profile note-label">Tasks</h2>
              <IconButton aria-label="add" size="large" className="organizer-profile add-button" onClick={handleTaskOpen}>
                <AddCircleOutlineIcon fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="add" size="large" className="organizer-profile add-button" onClick={emptyTasks}>
              <DeleteIcon fontSize="inherit" />
              </IconButton>
            </div>
            {organizerTasks}
          </div>
        </BaseContainer>
      </div>

      <Modal
        open={noteModalOpen}
        onClose={handleNoteClose}
        aria-labelledby="add-note-modal"
        aria-describedby="add-note-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4
        }}>
          <Typography id="add-note-modal" variant="h6" component="h2">
            Add a new note
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="New Note"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAddNote} sx={{ mt: 2 }}>
            Add Note
          </Button>
          <Button variant="outlined" onClick={handleNoteClose} sx={{ mt: 2, ml: 1 }}>
            Close
          </Button>
        </Box>
      </Modal>

      <Modal
        open={taskModalOpen}
        onClose={handleTaskClose}
        aria-labelledby="add-task-modal"
        aria-describedby="add-task-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4
        }}>
          <Typography id="add-task-modal" variant="h6" component="h2">
            Add a new task
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="New Task"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAddTask} sx={{ mt: 2 }}>
            Add Task
          </Button>
          <Button variant="outlined" onClick={handleTaskClose} sx={{ mt: 2, ml: 1 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default OrganizerProfile;
