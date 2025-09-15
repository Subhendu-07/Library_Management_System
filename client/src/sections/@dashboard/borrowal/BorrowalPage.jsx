import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import { Alert } from "@mui/lab";

import { useAuth } from "../../../hooks/useAuth";
import Label from "../../../components/label";
import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";

import BorrowalListHead from "./BorrowalListHead";
import BorrowalForm from "./BorrowalForm";
import BorrowalsDialog from "./BorrowalDialog";
import { applySortFilter, getComparator } from "../../../utils/tableOperations";
import { apiUrl, methods, routes } from "../../../constants";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "memberName", label: "Member Name", alignRight: false },
  { id: "bookName", label: "Book Name", alignRight: false },
  { id: "borrowedDate", label: "Borrowed On", alignRight: false },
  { id: "dueDate", label: "Due On", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "", label: "", alignRight: true }
];

// ----------------------------------------------------------------------

const BorrowalPage = () => {
  const { user } = useAuth();

  // --- State ---
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("borrowedDate");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [borrowals, setBorrowals] = useState([]);
  const [borrowalForm, setBorrowalForm] = useState({
    bookId: "",
    memberId: "",
    borrowedDate: "",
    dueDate: "",
    status: ""
  });

  const [selectedBorrowalId, setSelectedBorrowalId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  // --- Load data ---
  useEffect(() => {
    fetchBorrowals();
    // eslint-disable-next-line
  }, []);

  const fetchBorrowals = async () => {
    try {
      const res = await axios.get(apiUrl(routes.BORROWAL, methods.GET_ALL));
      const data = res.data.borrowalsList || [];

      setBorrowals(user.isAdmin ? data : data.filter(b => b.memberId?._id === user._id));
    } catch (err) {
      console.error("Fetch borrowals error:", err);
      toast.error("Failed to load borrowals");
    } finally {
      setIsTableLoading(false);
    }
  };

  // --- CRUD operations ---
  const addBorrowal = async () => {
    try {
      await axios.post(apiUrl(routes.BORROWAL, methods.POST), borrowalForm);
      toast.success("Borrowal added");
      closeModal();
      fetchBorrowals();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again");
    }
  };

  const updateBorrowal = async () => {
    try {
      await axios.put(apiUrl(routes.BORROWAL, methods.PUT, selectedBorrowalId), borrowalForm);
      toast.success("Borrowal updated");
      closeModal();
      closeMenu();
      fetchBorrowals();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again");
    }
  };

  const deleteBorrowal = async () => {
    try {
      await axios.delete(apiUrl(routes.BORROWAL, methods.DELETE, selectedBorrowalId));
      toast.success("Borrowal deleted");
      closeDialog();
      closeMenu();
      fetchBorrowals();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again");
    }
  };

  const selectBorrowal = (id) => {
    const b = borrowals.find(item => item._id === id);
    setBorrowalForm(b || {
      bookId: "",
      memberId: "",
      borrowedDate: "",
      dueDate: "",
      status: ""
    });
  };

  const resetForm = () => {
    setBorrowalForm({
      bookId: "",
      memberId: "",
      borrowedDate: "",
      dueDate: "",
      status: ""
    });
  };

  // --- Handlers ---
  const openMenu = (event, id) => {
    setSelectedBorrowalId(id);
    setIsMenuOpen(event.currentTarget);
  };
  const closeMenu = () => setIsMenuOpen(null);
  const openModal = (update = false) => {
    setIsUpdateForm(update);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  // --- Table pagination ---
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- Table sorting ---
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // --- Render ---
  return (
    <>
      <Helmet>
        <title>Borrowals</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>Borrowals</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              resetForm();
              openModal(false);
            }}
          >
            New Borrowal
          </Button>
        </Stack>

        {isTableLoading ? (
          <Grid container justifyContent="center"><CircularProgress /></Grid>
        ) : (
          <Card>
            <Scrollbar>
              {borrowals.length > 0 ? (
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <BorrowalListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={borrowals.length}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {borrowals
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((b) => {
                          const isOverdue = b.dueDate && new Date(b.dueDate) < new Date();
                          return (
                            <TableRow key={b._id} hover tabIndex={-1}>                           
                              <TableCell>{b.memberId?.name || "N/A"}</TableCell>
                              <TableCell>{b.bookId?.name || "N/A"}</TableCell>
                              <TableCell>{b.borrowedDate ? new Date(b.borrowedDate).toLocaleDateString() : "-"}</TableCell>
                              <TableCell>{b.dueDate ? new Date(b.dueDate).toLocaleDateString() : "-"}</TableCell>
                              
                              {/* ✅ Status with color */}
                              <TableCell>
                                <Label
                                  color={isOverdue || b.status === "overdue" ? "error" : "success"}
                                  sx={{ px: 2, py: 0.5, borderRadius: 1 }}
                                >
                                  {isOverdue ? "overdue" : (b.status || "active")}
                                </Label>
                              </TableCell>

                              <TableCell align="right">
                                <IconButton size="large" color="inherit" onClick={(e) => openMenu(e, b._id)}>
                                  <Iconify icon="eva:more-vertical-fill" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="warning">No borrowals found</Alert>
              )}
            </Scrollbar>

            {borrowals.length > 0 && (
              <TablePagination
                component="div"
                count={borrowals.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            )}
          </Card>
        )}
      </Container>

      {/* Popover menu */}
      <Popover
        open={Boolean(isMenuOpen)}
        anchorEl={isMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 1, width: 140 } }}
      >
        <MenuItem onClick={() => { selectBorrowal(selectedBorrowalId); openModal(true); closeMenu(); }}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem sx={{ color: "error.main" }} onClick={openDialog}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Popover>

      <BorrowalForm
        isUpdateForm={isUpdateForm}
        isModalOpen={isModalOpen}
        handleCloseModal={closeModal}
        borrowal={borrowalForm}
        setBorrowal={setBorrowalForm}
        handleAddBorrowal={addBorrowal}
        handleUpdateBorrowal={updateBorrowal}
      />

      <BorrowalsDialog
        isDialogOpen={isDialogOpen}
        borrowalsId={selectedBorrowalId}
        handleDeleteBorrowal={deleteBorrowal}
        handleCloseDialog={closeDialog}
      />
    </>
  );
};

export default BorrowalPage;
