import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import "styles/views/ParticipantProfile.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Header from "./Header";
import organizerProfile from "assets/Kadie.jpeg";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Kid = ({ participant }) => (
  <div className="participant-profile content">
    <div className="participant-profile label-username">{participant.name}</div>
    <div className="participant-profile address">Address: {participant.address}</div>
    <div className="participant-profile dateOfBirth">Birthday: {participant.dateOfBirth}</div>
    <div className="participant-profile notes">Preferences: {participant.notes}</div>
  </div>
);

Kid.propTypes = {
  participant: PropTypes.object.isRequired,
};

const Note = ({ notes }) => (
  <div className="participant-profile container">
    <ul className="participant-profile note-list">
      {Array.isArray(notes) && notes.map((note) => (
        <li key={note.id} className="participant-profile note-item">
          <p>{note.content}</p>
        </li>
      ))}
    </ul>
  </div>
);

Note.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const ParentInfoItem = ({ parent }) => (
  <div className="participant-profile container">
    <div className="participant-profile relationship-label">{parent.relationship}:</div>
    <div className="participant-profile name">Name: {parent.parentName}</div>
    <div className="participant-profile email">Email: {parent.email}</div>
    <div className="participant-profile phoneNumber">Phone number: {parent.phoneNumber}</div>
    <div className="participant-profile address">Address: {parent.address}</div>
  </div>
);

ParentInfoItem.propTypes = {
  parent: PropTypes.object.isRequired,
};

const ParticipantProfile = () => {
  const navigate = useNavigate();
  const loggedInOrganizerId = localStorage.getItem("loggedInOrganizerId");
  const [loggedInOrganizerUsername, setLoggedInOrganizerUsername] = useState(localStorage.getItem("loggedInOrganizerUsername"));
  const [loggedInOrganizerPhoto, setLoggedInOrganizerPhoto] = useState(localStorage.getItem("loggedInOrganizerPhoto"));
  const [photoFile, setPhotoFile] = useState(null);

  const { participantId } = useParams();
  const [participant, setParticipant] = useState(null);
  const [notes, setNotes] = useState([]);
  const [parent, setParent] = useState([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [newParent, setNewParent] = useState({
    parentName: '',
    email: '',
    phoneNumber: '',
    address: '',
    relationship: '',
  });

  const handleNoteOpen = () => {
    setNewNoteContent('');
    setNoteModalOpen(true);
  };
  const handleNoteClose = () => setNoteModalOpen(false);

  const handleParentOpen = () => {
    setNewParent({
      parentName: '',
      email: '',
      phoneNumber: '',
      address: '',
      relationship: '',
    });
    setParentModalOpen(true);
  };
  const handleParentClose = () => setParentModalOpen(false);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      alert("Note content cannot be empty!");
      return;
    }
    const newNote = {
      content: newNoteContent
    };
    try {
      console.log(newNote);
      console.log(loggedInOrganizerId);
      console.log(participantId);
      await api.put(`/organizers/${loggedInOrganizerId}/participants/${participantId}/updatekidnotes`, newNote);
  
      // Directly update the notes state with the new note
      setNotes((prevNotes) => [
        ...prevNotes,
        { id: Date.now().toString(), content: newNoteContent } // Assuming id is generated as Date.now().toString()
      ]);
  
      handleNoteClose();
    } catch (error) {
      console.error(`Failed to update kid notes: \n${handleError(error)}`);
      alert("Failed to update kid notes! See the console for details.");
    }
  };
  

  const handleAddParent = async () => {
    if (!newParent.parentName.trim() || !newParent.email.trim() || !newParent.address.trim()
          || !newParent.relationship.trim() || !newParent.phoneNumber.trim()) {
      alert("Parent information cannot be empty!");
      return;
    }
    try {
      console.log(newParent.address);
      const response = await api.post(`/parents`, { ...newParent, participantId });
      
      // Directly update the parent state with the new parent
      setParent((prevParents) => [
        ...prevParents,
        { id: Date.now().toString(), ...newParent }
      ]);
  
      handleParentClose();
    } catch (error) {
      console.error(`Failed to add parent: \n${handleError(error)}`);
      alert("Failed to add parent! See the console for details.");
    }
  };
  

  const doParticipantDelete = async () => {
    try {
      await api.delete(`/organizers/${loggedInOrganizerId}/participants/${participantId}`);
      navigate(`/planner/organizers/${loggedInOrganizerId}/participants`);
    } catch (error) {
      console.error(`Failed to delete the participant: \n${handleError(error)}`);
      alert("Failed to delete the participant! See the console for details.");
    }
  };

  const emptyKidNotes = async () => {
    try {
      await api.delete(`/participants/${participantId}/emptykidnotes`);
      setNotes([]);
    } catch (error) {
      console.error(`Failed to empty kid notes: \n${handleError(error)}`);
      alert("Failed to empty kid notes! See the console for details.");
    }
  };

  const emptyParentInfo = async () => {
    try {
      await api.delete(`/parents/${participantId}`);
      setParent([]);
    } catch (error) {
      console.error(`Failed to empty parent info: \n${handleError(error)}`);
      alert("Failed to empty parent info! See the console for details.");
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

  const doParticipantUpdate = () => {
    navigate(`/planner/organizers/${loggedInOrganizerId}/participants/${participantId}/update`, { state: { organizerId: loggedInOrganizerId, participantId } });
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

  useEffect(() => {
    async function fetchData() {
      try {
        if (loggedInOrganizerId && participantId) {
          const response = await api.get(`/organizers/${loggedInOrganizerId}/participants/${participantId}`);
          console.log("API Response:", response.data); 
          setParticipant(response.data);
          console.log("API Response kidNotes:", response.data.kidNotes); 
          console.log("API Response:", response.data.parent); 
          setNotes(response.data.kidNotes);

          console.log("participantId:", participantId); 

          const resp = await api.get(`parents/${participantId}`);
          console.log("Parent: ", resp.data); 
          setParent(resp.data);
        }
      } catch (error) {
        console.error(`Something went wrong while fetching the participant: \n${handleError(error)}`);
        console.error("Detailed error:", error); 
        alert("Something went wrong while fetching the participant! See the console for details.");
      }
    }

    fetchData();
  }, [participantId, loggedInOrganizerId]);

  let content;

  if (participant) {
    content = (
      <div>
        <BaseContainer>
          <Kid participant={participant} />
        </BaseContainer>
      </div>
    );
  }

  let parentContent;

  if (parent.length > 0) {
    parentContent = parent.map((p) => (
      <BaseContainer key={p.id}>
        <ParentInfoItem parent={p} />
      </BaseContainer>
    ));
  } else {
    parentContent = "No parent information available.";
  }

  let kidNotes;

  if (Array.isArray(notes) && notes.length > 0) {
    kidNotes = (
      <div>
        <BaseContainer>
          <Note notes={notes} />
        </BaseContainer>
      </div>
    );
  } else {
    kidNotes = "No notes yet .. ";
  }

  return (
    <div>
      <Header />
      <div className="participant-profile parent">
        <BaseContainer className="participant-profile info-container">
          <img
            src={organizerProfile}
            className="participant-profile organizer-photo"
            alt="profile"
          />
          <input
            type="file"
            id="photoInput"
            style={{ display: 'none' }}
          />
          <h2 className="participant-profile organizer-name">{loggedInOrganizerUsername}</h2>
          <h2 className="participant-profile navigation" onClick={openMyProfile}>My Profile</h2>
          <h2 className="participant-profile navigation" onClick={openHistory}>Trip History</h2>
          <div className="participant-profile button-logout" onClick={logout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="participant-profile icon" />
          </div>
        </BaseContainer>
        <BaseContainer className="participant-profile participant-container">
          <div className="participant-profile upper-line">
            <div className="participant-profile button-go-back" onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} className="participant-profile icon" />
              <p>Kid Profile</p>
            </div>
            <div className="participant-profile user-icons">
              <IconButton aria-label="update" size="large" onClick={doParticipantUpdate}>
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="delete" size="large" onClick={doParticipantDelete}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </div>
          </div>
          <div className="participant-profile content">
            {content}
          </div>
          <div className="participant-profile notes-tasks-container">
            <div className="participant-profile notes-header">
              <h2 className="participant-profile note-label">Notes</h2>
              <IconButton aria-label="add" size="large" className="participant-profile add-button" onClick={handleNoteOpen}>
                <AddCircleOutlineIcon fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="add" size="large" className="participant-profile add-button" onClick={emptyKidNotes}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </div>
            {kidNotes}
          </div>
          <div className="participant-profile notes-tasks-container">
            <div className="participant-profile notes-header">
              <h2 className="participant-profile note-label">Parent Information</h2>
              <IconButton aria-label="add" size="large" className="participant-profile add-button" onClick={handleParentOpen}>
                <AddCircleOutlineIcon fontSize="inherit" />
              </IconButton>
              <IconButton aria-label="add" size="large" className="participant-profile add-button" onClick={emptyParentInfo}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </div>
            {parentContent}
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
        open={parentModalOpen}
        onClose={handleParentClose}
        aria-labelledby="add-parent-modal"
        aria-describedby="add-parent-description"
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
          <Typography id="add-parent-modal" variant="h6" component="h2">
            Add a new parent
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Parent Name"
            value={newParent.parentName}
            onChange={(e) => setNewParent({ ...newParent, parentName: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Email"
            value={newParent.email}
            onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Phone Number"
            value={newParent.phoneNumber}
            onChange={(e) => setNewParent({ ...newParent, phoneNumber: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Address"
            value={newParent.address}
            onChange={(e) => setNewParent({ ...newParent, address: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Relationship"
            value={newParent.relationship}
            onChange={(e) => setNewParent({ ...newParent, relationship: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleAddParent} sx={{ mt: 2 }}>
            Add Parent
          </Button>
          <Button variant="outlined" onClick={handleParentClose} sx={{ mt: 2, ml: 1 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ParticipantProfile;
