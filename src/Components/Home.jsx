import React, { useState, useEffect } from "react";
import {
    TextField,
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Snackbar,
    Alert,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Home = () => {
    // State for storing form inputs
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        dob: null,
        gender: "",
        hobbies: [],
        address: "",
        city: "",
        pincode: "",
    });

    // Ye State errors validate krne ke liye
    const [errors, setErrors] = useState({});

    // Ye State errors User Entries ko krne ke liye
    const [entries, setEntries] = useState([]);

    // Ye State Delete Dailog Box Manage krne ke liye
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);

    // Ye State errors validate Editing Handle krne ke liye 
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);

    // State for Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Load existing entries from localStorage when the component mounts
    useEffect(() => {
        const savedData = localStorage.getItem("formEntries");
        if (savedData) {
            setEntries(JSON.parse(savedData).entries);
        }
    }, []);

    // Handling the input changes for text fields and select
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handling the checkbox changes for hobbies
    const handleHobbyChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const newHobbies = checked
                ? [...prev.hobbies, value]
                : prev.hobbies.filter((hobby) => hobby !== value);
            return { ...prev, hobbies: newHobbies };
        });
    };

    // Validating form fields
    const validate = () => {
        let tempErrors = {};
        if (!formData.firstName) {
            tempErrors.firstName = "First Name is required";
        } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
            tempErrors.firstName = "Only letters are allowed";
        }

        if (!formData.lastName) {
            tempErrors.lastName = "Last Name is required";
        } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
            tempErrors.lastName = "Only letters are allowed";
        }

        if (!formData.age) {
            tempErrors.age = "Age is required";
        } else if (isNaN(formData.age) || Number(formData.age) <= 0) {
            tempErrors.age = "Enter a valid age";
        }

        if (!formData.dob) {
            tempErrors.dob = "Date of Birth is required";
        }

        if (!formData.gender) {
            tempErrors.gender = "Gender is required";
        }

        if (formData.hobbies.length === 0) {
            tempErrors.hobbies = "Select at least one hobby";
        }

        if (!formData.address) {
            tempErrors.address = "Address is required";
        }

        if (!formData.city) {
            tempErrors.city = "City is required";
        }

        if (!formData.pincode) {
            tempErrors.pincode = "Pincode is required";
        } else if (!/^\d{5,6}$/.test(formData.pincode)) {
            tempErrors.pincode = "Enter a valid pincode";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Handling form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const newEntry = {
                id: isEditing ? currentEditId : Date.now(), // Unique ID
                ...formData,
                dob: formData.dob ? formData.dob.format("YYYY-MM-DD") : "",
            };

            // Retrieve existing entries from localStorage
            const existingData =
                JSON.parse(localStorage.getItem("formEntries")) || { entries: [] };

            if (isEditing) {
                // Find the index of the entry to update
                const index = existingData.entries.findIndex(
                    (entry) => entry.id === currentEditId
                );
                if (index !== -1) {
                    existingData.entries[index] = newEntry; // Update the entry
                }
            } else {
                // Add new entry
                existingData.entries.push(newEntry);
            }

            // Save back to localStorage
            localStorage.setItem("formEntries", JSON.stringify(existingData));

            // Update entries state to display
            setEntries(existingData.entries);

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                age: "",
                dob: null,
                gender: "",
                hobbies: [],
                address: "",
                city: "",
                pincode: "",
            });

            // Clear errors and editing states
            setErrors({});
            setIsEditing(false);
            setCurrentEditId(null);

            // Show success message
            setSnackbarMessage(isEditing ? "Entry updated successfully!" : "Entry added successfully!");
            setOpenSnackbar(true);
        }
    };

    // Open delete dialog
    const handleDeleteClick = (entry) => {
        setEntryToDelete(entry);
        setOpenDeleteDialog(true);
    };

    // Confirm delete entry
    const confirmDelete = () => {
        const updatedEntries = entries.filter(
            (entry) => entry.id !== entryToDelete.id
        );
        setEntries(updatedEntries);
        localStorage.setItem("formEntries", JSON.stringify({ entries: updatedEntries }));
        setOpenDeleteDialog(false);
        setEntryToDelete(null);

        // Show delete message
        setSnackbarMessage("Entry deleted successfully!");
        setOpenSnackbar(true);
    };

    // Close delete dialog
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setEntryToDelete(null);
    };

    // Handle Edit button click
    const handleEditClick = (entry) => {
        setFormData({
            firstName: entry.firstName,
            lastName: entry.lastName,
            age: entry.age,
            dob: dayjs(entry.dob), // Convert string back to Day.js object
            gender: entry.gender,
            hobbies: entry.hobbies,
            address: entry.address,
            city: entry.city,
            pincode: entry.pincode,
        });
        setIsEditing(true);
        setCurrentEditId(entry.id);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                sx={{
                    backgroundColor: "#e0f7fa",
                    minHeight: "100vh",
                    paddingY: 5,
                }}
            >
                <Typography variant="h4" align="center" gutterBottom color="#00796b">
                    Register Here!
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{

                        maxWidth: "500px",
                        margin: "auto",
                        padding: "30px",
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* First Name */}
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#bdbdbd",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#00796b",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#00796b",
                                },
                            },
                        }}
                    />

                    {/* Last Name */}
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#bdbdbd",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#00796b",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#00796b",
                                },
                            },
                        }}
                    />

                    {/* Age */}
                    <TextField
                        label="Age"
                        name="age"
                        type="text"
                        value={formData.age}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={!!errors.age}
                        helperText={errors.age}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#bdbdbd",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#00796b",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#00796b",
                                },
                            },
                        }}
                    />

                    {/* Date of Birth */}
                    <DatePicker
                        label="Date of Birth"
                        value={formData.dob}
                        onChange={(newDate) =>
                            setFormData({ ...formData, dob: newDate })
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                error={!!errors.dob}
                                helperText={errors.dob}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#bdbdbd",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#00796b",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#00796b",
                                        },
                                    },
                                }}
                            />
                        )}
                    />

                    {/* Gender */}
                    <FormControl
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={!!errors.gender}
                    >
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            label="Gender"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        {errors.gender && (
                            <Typography variant="caption" color="error">
                                {errors.gender}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Hobbies */}
                    <FormControl
                        component="fieldset"
                        margin="normal"
                        error={!!errors.hobbies}
                    >
                        <FormLabel component="legend">Hobbies</FormLabel>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.hobbies.includes("Cricket")}
                                        onChange={handleHobbyChange}
                                        value="Cricket"
                                        sx={{
                                            color: "#00796b",
                                            "&.Mui-checked": {
                                                color: "#00796b",
                                            },
                                        }}
                                    />
                                }
                                label="Cricket"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.hobbies.includes("Squash")}
                                        onChange={handleHobbyChange}
                                        value="Squash"
                                        sx={{
                                            color: "#00796b",
                                            "&.Mui-checked": {
                                                color: "#00796b",
                                            },
                                        }}
                                    />
                                }
                                label="Squash"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.hobbies.includes("Walking")}
                                        onChange={handleHobbyChange}
                                        value="Walking"
                                        sx={{
                                            color: "#00796b",
                                            "&.Mui-checked": {
                                                color: "#00796b",
                                            },
                                        }}
                                    />
                                }
                                label="Walking"
                            />
                        </FormGroup>
                        {errors.hobbies && (
                            <Typography variant="caption" color="error">
                                {errors.hobbies}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Address */}
                    <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={!!errors.address}
                        helperText={errors.address}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#bdbdbd",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#00796b",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#00796b",
                                },
                            },
                        }}
                    />

                    {/* City */}
                    <TextField
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#bdbdbd",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#00796b",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#00796b",
                                },
                            },
                        }}
                    />

                    {/* Pincode */}
                    <TextField
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        error={!!errors.pincode}
                        helperText={errors.pincode}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#bdbdbd",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#00796b",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#00796b",
                                },
                            },
                        }}
                    />

                    {/* Submit or Update Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            mt: 3,
                            py: 1.5,
                            backgroundColor: "#00796b",
                            "&:hover": {
                                backgroundColor: "#00695c",
                            },
                        }}
                    >
                        {isEditing ? "Update" : "Submit"}
                    </Button>
                </Box>

                {/* Entries List */}
                <Typography
                    variant="h5"
                    align="center"
                    gutterBottom
                    sx={{ mt: 5, color: "#00796b" }}
                >
                    Entries Entered
                </Typography>
                <Box sx={{ maxWidth: "800px", margin: "auto" }}>
                    {entries.length > 0 ? (
                        entries.map((entry) => (
                            <Box
                                key={entry.id}
                                sx={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    marginBottom: "20px",
                                    backgroundColor: "#ffffff",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    <strong>Name:</strong> {entry.firstName}{" "}
                                    {entry.lastName}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    <strong>Age:</strong> {entry.age}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    <strong>Date of Birth:</strong> {entry.dob}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    <strong>Gender:</strong> {entry.gender}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    <strong>Hobbies:</strong>{" "}
                                    {entry.hobbies.join(", ")}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    <strong>Address:</strong> {entry.address},{" "}
                                    {entry.city}, {entry.pincode}
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ mt: 3 }}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditClick(entry)}
                                        sx={{
                                            backgroundColor: "#00796b",
                                            "&:hover": {
                                                backgroundColor: "#00695c",
                                            },
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteClick(entry)}
                                        sx={{
                                            borderColor: "#d32f2f",
                                            color: "#d32f2f",
                                            "&:hover": {
                                                borderColor: "#c62828",
                                                backgroundColor: "#ffebee",
                                            },
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            </Box>
                        ))
                    ) : (
                        <Typography
                            variant="body1"
                            align="center"
                            color="#757575"
                        >
                            No Entries Available.
                        </Typography>
                    )}
                </Box>

                {/* Confirmation Dialog for Delete */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                >
                    <DialogTitle sx={{ backgroundColor: "#f5f5f5" }}>
                        Confirm Delete
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this entry?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseDeleteDialog}
                            color="primary"
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            color="error"
                            variant="contained"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for Feedback */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={2000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity="success"
                        sx={{ width: "100%" }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default Home;
