import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Iconify from "../../../components/iconify";
import { useAuth } from "../../../hooks/useAuth";

const BorrowalForm = ({
  handleAddBorrowal,
  handleUpdateBorrowal,
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  borrowal,
  setBorrowal,
}) => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // ---------------- Fetch members ----------------
  const getAllMembers = async () => {
    try {
      setLoadingMembers(true);
      const { data } = await axios.get("http://localhost:8080/api/user/getAllMembers");
      // eslint-disable-next-line prefer-destructuring
      let membersList = data.membersList;

      if (!user.isAdmin) {
        membersList = membersList.filter((member) => member._id === user._id);
        setBorrowal((prev) => ({ ...prev, memberId: user._id }));
      }

      setMembers(membersList);
    } catch (error) {
      toast.error("Error fetching members");
      console.error(error);
    } finally {
      setLoadingMembers(false);
    }
  };

  // ---------------- Fetch books ----------------
  const getAllBooks = async () => {
    try {
      setLoadingBooks(true);
      const { data } = await axios.get("http://localhost:8080/api/book/getAll");
      setBooks(data.booksList);
    } catch (error) {
      toast.error("Error fetching books");
      console.error(error);
    } finally {
      setLoadingBooks(false);
    }
  };

  // ---------------- Lifecycle ----------------
  useEffect(() => {
    getAllMembers();
    getAllBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default dates
  useEffect(() => {
    if (!borrowal.borrowedDate) {
      setBorrowal((prev) => ({
        ...prev,
        borrowedDate: new Date().toISOString().split("T")[0],
      }));
    }
    if (!borrowal.dueDate) {
      const due = new Date();
      due.setDate(due.getDate() + 14);
      setBorrowal((prev) => ({
        ...prev,
        dueDate: due.toISOString().split("T")[0],
      }));
    }
  }, [borrowal, setBorrowal]);

  // ---------------- Styles ----------------
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  // ---------------- Derived states ----------------
  const isSubmitDisabled =
    !borrowal.memberId || !borrowal.bookId || !borrowal.borrowedDate || !borrowal.dueDate;

  // ---------------- JSX ----------------
  return (
    <Modal open={isModalOpen} onClose={handleCloseModal}>
      <Box sx={style}>
        <Container>
          <Typography variant="h4" textAlign="center" mb={3}>
            {isUpdateForm ? "Update Borrowal" : "Add Borrowal"}
          </Typography>
          <Stack spacing={3}>
            {/* Member & Book */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Member</InputLabel>
                  <Select
                    value={borrowal.memberId || ""}
                    disabled={!user.isAdmin || loadingMembers}
                    onChange={({ target: { value } }) =>
                      setBorrowal((prev) => ({ ...prev, memberId: value }))
                    }
                  >
                    {loadingMembers ? (
                      <MenuItem disabled>Loading...</MenuItem>
                    ) : (
                      members.map((member) => (
                        <MenuItem key={member._id} value={member._id}>
                          {member.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Book</InputLabel>
                  <Select
                    value={borrowal.bookId || ""}
                    onChange={({ target: { value } }) =>
                      setBorrowal((prev) => ({ ...prev, bookId: value }))
                    }
                  >
                    {loadingBooks ? (
                      <MenuItem disabled>Loading...</MenuItem>
                    ) : (
                      books
                        .filter((book) => book.isAvailable)
                        .map((book) => (
                          <MenuItem key={book._id} value={book._id}>
                            {book.name}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Dates */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Borrowed Date"
                  type="date"
                  fullWidth
                  value={borrowal.borrowedDate || ""}
                  InputLabelProps={{ shrink: true }}
                  onChange={({ target: { value } }) =>
                    setBorrowal((prev) => ({ ...prev, borrowedDate: value }))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Due Date"
                  type="date"
                  fullWidth
                  value={borrowal.dueDate || ""}
                  InputLabelProps={{ shrink: true }}
                  onChange={({ target: { value } }) =>
                    setBorrowal((prev) => ({ ...prev, dueDate: value }))
                  }
                />
              </Grid>
            </Grid>

            {/* Status */}
            <TextField
              label="Status"
              fullWidth
              value={borrowal.status || ""}
              onChange={({ target: { value } }) =>
                setBorrowal((prev) => ({ ...prev, status: value }))
              }
            />

            {/* Buttons */}
            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Iconify icon="bi:check-lg" />}
                onClick={isUpdateForm ? handleUpdateBorrowal : handleAddBorrowal}
                disabled={isSubmitDisabled}
                sx={{ mr: 2 }}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="error"
                startIcon={<Iconify icon="charm:cross" />}
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Modal>
  );
};

BorrowalForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  borrowal: PropTypes.object,
  setBorrowal: PropTypes.func,
  handleAddBorrowal: PropTypes.func,
  handleUpdateBorrowal: PropTypes.func,
};

export default BorrowalForm;
