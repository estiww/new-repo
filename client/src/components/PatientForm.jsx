import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box,
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    roleName: "Patient",
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    email: "",
    password: "",
    gender: "",
    city: "",
    neighborhood: "",
    street: "",
    houseNumber: "",
    zipCode: "",     
     isApproved:false,
    communicationMethod: "",
  });

  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.birthDate) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("You have entered an invalid email address!");
      return;
    }
    if (!validateBirthDate(formData.birthDate)) {
      setError("You have entered an invalid birth date!");
      return;
    }

    const url = `http://localhost:3000/signup`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return response.json();
      })
      .then(() => {
        setOpen(true);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setError("Failed to create patient request");
      });

    setError("");
  };

  const validateEmail = (mailAddress) => {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return mailAddress.match(mailformat);
  };

  const validateBirthDate = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      return age > 18;
    }
    return age >= 18;
  };

  const handleClose = () => {
    setOpen(false);
    window.location.href = "/";
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h6">Patient Registration</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Box>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Birth Date"
            name="birthDate"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.birthDate}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Box>

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Preferred Communication Method</FormLabel>
          <RadioGroup
            row
            name="communicationMethod"
            value={formData.communicationMethod}
            onChange={handleChange}
          >
            <FormControlLabel value="WhatsApp" control={<Radio />} label="WhatsApp" />
            <FormControlLabel value="Email" control={<Radio />} label="Email" />
            <FormControlLabel value="Phone" control={<Radio />} label="Phone" />
          </RadioGroup>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 2 }}>Address</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Neighborhood"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="House Number"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Zip Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </Box>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Submit Patient Request
        </Button>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleOutlineIcon color="success" />
            Request Successful
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your request has been received and is pending approval.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientForm;
