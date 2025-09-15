import { Helmet } from "react-helmet-async";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Avatar,
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
  Typography,
} from "@mui/material";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import Label from "../../../components/label";
import UserTableHead from "./UserListHead";
import UserForm from "./UserForm";
import UserDialog from "./UserDialog";
import { apiUrl, methods, routes } from "../../../constants";

// ---------------- Table Head ----------------
const TABLE_HEAD = [
  { id: "photo", label: "Photo" },
  { id: "name", label: "Name" },
  { id: "dob", label: "DOB" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "role", label: "Role" },
  { id: "actions", label: "Actions", alignRight: true },
];

export default function UserPage() {
  // ---------------- State ----------------
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
    phone: "",
    isAdmin: false,
    file: null,
  });
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // ---------------- Helpers ----------------
  const defaultPhoto =
    "https://www.pngitem.com/pimgs/m/645-6452863_profile-image-memoji-brown-hair-man-with-glasses.png";

  const clearForm = () =>
    setUser({
      name: "",
      dob: "",
      email: "",
      password: "",
      phone: "",
      isAdmin: false,
      file: null,
    });

  const buildFormData = () => {
    const formData = new FormData();
    Object.entries(user).forEach(([key, value]) => {
      if (value && key !== "file") formData.append(key, value);
    });
    if (user.file) formData.append("photo", user.file);
    return formData;
  };

  // ---------------- API Calls ----------------
  const getAllUsers = useCallback(() => {
    setLoading(true);
    axios
      .get(apiUrl(routes.USER, methods.GET_ALL))
      .then((res) => {
        const mappedUsers = res.data.usersList.map((u) => ({
          ...u,
          photoUrl: u.photo ? `http://localhost:5000${u.photo}` : defaultPhoto,
        }));
        setUsers(mappedUsers);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddUser = () => {
    axios
      .post(apiUrl(routes.USER, methods.POST), buildFormData(), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        toast.success("User added successfully");
        setModalOpen(false);
        getAllUsers();
        clearForm();
      })
      .catch((err) => {
        toast.error(
          err.response?.status === 403
            ? "User already exists"
            : "Something went wrong"
        );
        console.error(err);
      });
  };

  const handleUpdateUser = () => {
    axios
      .put(apiUrl(routes.USER, methods.PUT, selectedUserId), buildFormData(), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        toast.success("User updated successfully");
        setModalOpen(false);
        getAllUsers();
        clearForm();
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.error(err);
      });
  };

  const handleDeleteUser = () => {
    axios
      .delete(apiUrl(routes.USER, methods.DELETE, selectedUserId))
      .then(() => {
        toast.success("User deleted successfully");
        setDialogOpen(false);
        getAllUsers();
      })
      .catch((err) => {
        toast.error("Something went wrong");
        console.error(err);
      });
  };

  // ---------------- Effects ----------------
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  // ---------------- Render ----------------
  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>

      <Container>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3">Users</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setIsUpdateMode(false);
              clearForm();
              setModalOpen(true);
            }}
          >
            New User
          </Button>
        </Stack>

        {/* Table */}
        {loading ? (
          <Grid sx={{ textAlign: "center" }}>
            <CircularProgress size="lg" />
          </Grid>
        ) : (
          <Card>
            <Scrollbar>
              {users.length > 0 ? (
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserTableHead headLabel={TABLE_HEAD} rowCount={users.length} />
                    <TableBody>
                      {users
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((u) => (
                          <TableRow hover key={u._id}>
                            <TableCell>
                              <Avatar src={u.photoUrl} alt={u.name} />
                            </TableCell>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>
                              {u.dob ? new Date(u.dob).toLocaleDateString() : ""}
                            </TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.phone}</TableCell>
                            <TableCell>
                              {u.isAdmin ? (
                                <Label color="warning">Librarian</Label>
                              ) : (
                                <Label color="success">Member</Label>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={(e) => {
                                  setSelectedUserId(u._id);
                                  setMenuAnchor(e.currentTarget);
                                }}
                              >
                                <Iconify icon="eva:more-vertical-fill" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography p={3}>No users found</Typography>
              )}
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Card>
        )}
      </Container>

      {/* User Form Modal */}
      <UserForm
        isUpdateForm={isUpdateMode}
        isModalOpen={modalOpen}
        handleCloseModal={() => setModalOpen(false)}
        user={user}
        setUser={setUser}
        handleAddUser={handleAddUser}
        handleUpdateUser={handleUpdateUser}
      />

      {/* Delete Confirmation Dialog */}
      <UserDialog
        isDialogOpen={dialogOpen}
        userId={selectedUserId}
        handleDeleteUser={handleDeleteUser}
        handleCloseDialog={() => setDialogOpen(false)}
      />

      {/* Action Menu */}
      <Popover
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setIsUpdateMode(true);
            const selectedUser = users.find((u) => u._id === selectedUserId);
            setUser({ ...selectedUser, file: null });
            setMenuAnchor(null);
            setModalOpen(true);
          }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} /> Edit
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            setDialogOpen(true);
            setMenuAnchor(null);
          }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} /> Delete
        </MenuItem>
      </Popover>
    </>
  );
}
