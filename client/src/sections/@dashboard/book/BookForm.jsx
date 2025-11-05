import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Iconify from "../../../components/iconify";

const BookForm = ({
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  book,
  setBook,
  refreshBooks
}) => {
  const [isModalLoading, setIsModalLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);

  const getAllAuthors = () => {
    axios
      .get(`http://localhost:8080/api/author/getAll`)
      .then((response) => setAuthors(response.data.authorsList))
      .catch(() => toast.error("Error fetching authors"));
  };

  const getAllGenres = () => {
    axios
      .get(`http://localhost:8080/api/genre/getAll`)
      .then((response) => {
        setGenres(response.data.genresList);
        setIsModalLoading(false);
      })
      .catch(() => toast.error("Error fetching genres"));
  };

  useEffect(() => {
    getAllAuthors();
    getAllGenres();
  }, []);

  // --- Add Book ---
  const handleAddBook = async () => {
    try {
      const formData = new FormData();
      formData.append("name", book.name);
      formData.append("isbn", book.isbn);
      formData.append("authorId", book.authorId);
      formData.append("genreId", book.genreId);
      formData.append("isAvailable", book.isAvailable);
      formData.append("summary", book.summary);

      if (book.file) formData.append("file", book.file);

      await axios.post(`http://localhost:8080/api/book/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Book added successfully!");
      handleCloseModal();
      refreshBooks();
    } catch (error) {
      toast.error(error.response?.data?.err || "Error adding book");
    }
  };

  // --- Update Book ---
  const handleUpdateBook = async () => {
    try {
      const formData = new FormData();
      formData.append("name", book.name);
      formData.append("isbn", book.isbn);
      formData.append("authorId", book.authorId);
      formData.append("genreId", book.genreId);
      formData.append("isAvailable", book.isAvailable);
      formData.append("summary", book.summary);

      if (book.file instanceof File) formData.append("file", book.file);

      await axios.put(
        `http://localhost:8080/api/book/update/${book._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Book updated successfully!");
      handleCloseModal();
      refreshBooks();
    } catch (error) {
      toast.error(error.response?.data?.err || "Error updating book");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "white",
    borderRadius: "20px",
    boxShadow: 16,
    p: 2
  };

  return (
    <Modal open={isModalOpen} onClose={handleCloseModal}>
      <Box sx={style}>
        <Container>
          <Typography variant="h4" textAlign="center" pb={2} pt={1}>
            {isUpdateForm ? "Update" : "Add"} Book
          </Typography>

          {isModalLoading ? (
            <Grid p={4} textAlign="center">
              <CircularProgress />
            </Grid>
          ) : (
            <Stack spacing={3} py={2} px={3} height="600px" overflow="scroll">
              <TextField
                name="name"
                label="Book name"
                value={book.name || ""}
                required
                onChange={(e) => setBook({ ...book, name: e.target.value })}
              />
              <TextField
                name="isbn"
                label="ISBN"
                value={book.isbn || ""}
                required
                onChange={(e) => setBook({ ...book, isbn: e.target.value })}
              />

              {/* Author */}
              <FormControl sx={{ m: 1 }}>
                <InputLabel>Author</InputLabel>
                <Select
                  value={book.authorId || ""}
                  onChange={(e) =>
                    setBook({ ...book, authorId: e.target.value })
                  }
                >
                  {authors.map((a) => (
                    <MenuItem key={a._id} value={a._id}>
                      {a.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Genre */}
              <FormControl sx={{ m: 1 }}>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={book.genreId || ""}
                  onChange={(e) =>
                    setBook({ ...book, genreId: e.target.value })
                  }
                >
                  {genres.map((g) => (
                    <MenuItem key={g._id} value={g._id}>
                      {g.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Availability */}
              <FormControl>
                <FormLabel>Availability</FormLabel>
                <RadioGroup
                  value={String(book.isAvailable)}
                  onChange={(e) =>
                    setBook({ ...book, isAvailable: e.target.value === "true" })
                  }
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Available"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Not available"
                  />
                </RadioGroup>
              </FormControl>

              {/* Summary */}
              <TextField
                name="summary"
                label="Summary"
                value={book.summary || ""}
                multiline
                rows={3}
                onChange={(e) => setBook({ ...book, summary: e.target.value })}
              />

              {/* Upload file (image or PDF) */}
              <Button variant="outlined" component="label" color="info">
                Upload Image or PDF
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setBook({ ...book, file });
                  }}
                />
              </Button>
              {book.file && (
                <Typography variant="body2" color="text.secondary">
                  Selected: {book.file.name}
                </Typography>
              )}

              <Box textAlign="center" pb={2}>
                <Button
                  variant="contained"
                  onClick={isUpdateForm ? handleUpdateBook : handleAddBook}
                  startIcon={<Iconify icon="bi:check-lg" />}
                  sx={{ mr: 2 }}
                >
                  Submit
                </Button>
                <Button
                  color="inherit"
                  variant="contained"
                  onClick={handleCloseModal}
                  startIcon={<Iconify icon="charm:cross" />}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          )}
        </Container>
      </Box>
    </Modal>
  );
};

BookForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  book: PropTypes.object,
  setBook: PropTypes.func,
  refreshBooks: PropTypes.func
};

export default BookForm;
