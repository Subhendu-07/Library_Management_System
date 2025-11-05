import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Typography
} from "@mui/material";
import { Alert } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { useAuth } from "../../../hooks/useAuth";
import Label from "../../../components/label";
import BookDialog from "./BookDialog";
import BookForm from "./BookForm";
import Iconify from "../../../components/iconify";

const StyledBookImage = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute",
  borderRadius: "8px"
});

const BookPage = () => {
  const { user } = useAuth();
  const [book, setBook] = useState({});
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  // Fetch all books
  const getAllBooks = () => {
    setIsTableLoading(true);
    axios
      .get(`http://localhost:8080/api/book/getAll`)
      .then((res) => {
        setBooks(res.data.booksList || []);
        setIsTableLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch books");
        setIsTableLoading(false);
      });
  };

  // Delete book
  const deleteBook = (bookId) => {
    axios
      .delete(`http://localhost:8080/api/book/delete/${bookId}`)
      .then(() => {
        toast.success("Book deleted");
        handleCloseDialog();
        handleCloseMenu();
        getAllBooks();
      })
      .catch(() => toast.error("Error deleting book"));
  };

  const getSelectedBookDetails = () => {
    const selected = books.find((b) => b._id === selectedBookId);
    setBook(selected || {});
  };

  // Menu & modal handlers
  const handleOpenMenu = (e) => setIsMenuOpen(e.currentTarget);
  const handleCloseMenu = () => setIsMenuOpen(null);
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    getAllBooks();
  }, []);

  return (
    <>
      <Helmet>
        <title>Books</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3">Books</Typography>
          {user.isAdmin && (
            <Button
              variant="contained"
              onClick={() => {
                setIsUpdateForm(false);
                setBook({});
                handleOpenModal();
              }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Book
            </Button>
          )}
        </Stack>

        {isTableLoading ? (
          <Grid p={2} textAlign="center">
            <CircularProgress />
          </Grid>
        ) : books.length > 0 ? (
          <Grid container spacing={4}>
            {books.map((b) => (
              <Grid key={b._id} item xs={12} sm={6} md={4}>
                <Card sx={{ position: "relative" }}>
                  <Box sx={{ pt: "80%", position: "relative" }}>
                    <Label
                      variant="filled"
                      sx={{
                        zIndex: 9,
                        top: 16,
                        left: 16,
                        position: "absolute",
                        color: "primary.main"
                      }}
                    >
                      {b.genre?.name || "Unknown"}
                    </Label>

                    {user.isAdmin && (
                      <Label
                        variant="filled"
                        sx={{
                          zIndex: 9,
                          top: 12,
                          right: 16,
                          position: "absolute",
                          borderRadius: "100%",
                          width: 30,
                          height: 30,
                          backgroundColor: "white"
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            setSelectedBookId(b._id);
                            handleOpenMenu(e);
                          }}
                        >
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      </Label>
                    )}

                    <StyledBookImage
                      src={
                        b.photoUrl
                          ? `http://localhost:8080${b.photoUrl}`
                          : "/default-book.jpg"
                      }
                      alt={b.name}
                    />
                  </Box>

                  <Stack spacing={1} sx={{ p: 2 }}>
                    <Typography textAlign="center" variant="h5" noWrap>
                      {b.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#888" }}
                      noWrap
                      textAlign="center"
                    >
                      {b.author?.name || "Unknown Author"}
                    </Typography>
                    <Label color={b.isAvailable ? "success" : "error"} sx={{ p: 1 }}>
                      {b.isAvailable ? "Available" : "Not Available"}
                    </Label>
                    <Typography variant="subtitle2" textAlign="center" mt={1}>
                      ISBN: {b.isbn}
                    </Typography>
                    <Typography variant="body2" textAlign="center">
                      {b.summary}
                    </Typography>

                    {/* PDF Button */}
                    {b.pdfUrl && (
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        href={`http://localhost:8080${b.pdfUrl}`}
                        target="_blank"
                      >
                        View PDF
                      </Button>
                    )}
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="warning">No books found</Alert>
        )}
      </Container>

      {/* Menu */}
      <Popover
        open={Boolean(isMenuOpen)}
        anchorEl={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setIsUpdateForm(true);
            getSelectedBookDetails();
            handleCloseMenu();
            handleOpenModal();
          }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} /> Edit
        </MenuItem>
        <MenuItem sx={{ color: "error.main" }} onClick={handleOpenDialog}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} /> Delete
        </MenuItem>
      </Popover>

      {/* Forms & Dialogs */}
      <BookForm
        isUpdateForm={isUpdateForm}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        book={book}
        setBook={setBook}
        refreshBooks={getAllBooks}
      />
      <BookDialog
        isDialogOpen={isDialogOpen}
        bookId={selectedBookId}
        handleDeleteBook={deleteBook}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};

export default BookPage;
