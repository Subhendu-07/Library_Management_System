import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import Iconify from "../../../components/iconify";

export default function UserForm({
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  user,
  setUser,
  handleAddUser,
  handleUpdateUser,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 800,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: { xs: 2, md: 4 },
    overflowY: "auto",
    maxHeight: "90vh",
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUser({ ...user, file });
    }
  };

  const handleSubmit = () => {
    if (isUpdateForm) {
      handleUpdateUser();
    } else {
      handleAddUser();
    }
  };

  return (
    <Modal open={isModalOpen} onClose={handleCloseModal}>
      <Box sx={style}>
        <Container disableGutters>
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: 3 }}
          >
            {isUpdateForm ? "Update User" : "Add User"}
          </Typography>

          <Stack spacing={3}>
            {/* Name and DOB */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={user.name || ""}
                  autoFocus
                  required
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  value={user.dob || ""}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setUser({ ...user, dob: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            {/* Email and Phone */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={user.email || ""}
                  required
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone"
                  type="tel"
                  value={user.phone || ""}
                  onChange={(e) =>
                    setUser({ ...user, phone: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            {/* Role */}
            <FormControl component="fieldset">
              <FormLabel id="role-label" sx={{ textAlign: "center" }}>
                User Role
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="role-label"
                value={user.isAdmin ? "true" : "false"}
                onChange={(e) =>
                  setUser({ ...user, isAdmin: e.target.value === "true" })
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Librarian"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Member"
                />
              </RadioGroup>
            </FormControl>

            {/* Password */}
            <TextField
              name="password"
              type="password"
              label="Password"
              value={user.password || ""}
              required={!user._id}
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
            />

            {/* File upload */}
            <Box>
              <Button
                variant="outlined"
                component="label"
                color="info"
                startIcon={<Iconify icon="mdi:upload" />}
              >
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {user.file && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Selected: {user.file.name}
                </Typography>
              )}
            </Box>

            {/* Buttons */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 2 }}
            >
              <Button
                size="large"
                variant="contained"
                onClick={handleSubmit}
                startIcon={<Iconify icon="bi:check-lg" />}
              >
                Submit
              </Button>

              <Button
                size="large"
                color="inherit"
                variant="outlined"
                onClick={handleCloseModal}
                startIcon={<Iconify icon="charm:cross" />}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Modal>
  );
}

UserForm.propTypes = {
  isUpdateForm: PropTypes.bool.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  handleAddUser: PropTypes.func.isRequired,
  handleUpdateUser: PropTypes.func.isRequired,
};
