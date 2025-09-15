import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import PropTypes from "prop-types";

export default function UserDialog({ isDialogOpen, handleCloseDialog, handleDeleteUser, userId }) {
  const handleConfirmDelete = () => {
    handleDeleteUser(userId);
    handleCloseDialog();
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
        <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

UserDialog.propTypes = {
  isDialogOpen: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
  handleDeleteUser: PropTypes.func,
  userId: PropTypes.string
};
