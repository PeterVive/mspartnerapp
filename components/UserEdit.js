import useSWR from "swr";
import {
  TextField,
  InputAdornment,
  Box,
  Paper,
  FormGroup,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  FormControl,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { Save } from "@mui/icons-material/";
import { useFormik } from "formik";

export default function UserEdit({ user, domains, tenant, ...props }) {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorSnackbar(false);
  };
  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  const formik = useFormik({
    initialValues: {
      startUserPrincipalName: user.userPrincipalName.split("@")[0],
      endUserPrincipalName: user.userPrincipalName.split("@")[1],
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
    },
    onSubmit: async (values, { setErrors }) => {
      const body = {
        userPrincipalName: `${values.startUserPrincipalName}@${values.endUserPrincipalName}`,
        firstName: values.firstName,
        lastName: values.lastName,
        displayName: values.displayName,
      };
      //

      try {
        const response = await fetch(
          `/api/tenants/${tenant.customerId}/users/${user.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(body),
          }
        );
        if (!response.ok) {
          throw await response.json();
        } else {
          setOpenSuccessSnackbar(true);
        }
      } catch (error) {
        setSubmitError(error.error);
        setOpenErrorSnackbar(true);
      }
    },
  });

  const verifiedDomains = [];
  domains.forEach(function (domain) {
    if (domain.isVerified) {
      verifiedDomains.push(domain);
    }
  });

  return (
    <Paper>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully saved changes
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {submitError}
        </Alert>
      </Snackbar>
      <Box sx={{ p: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormGroup row={true}>
              <Tooltip title="Cannot be edited. AD-Synced user.">
                <TextField
                  id="startUserPrincipalName"
                  label="User principal name"
                  required={true}
                  value={formik.values.startUserPrincipalName}
                  onChange={formik.handleChange}
                  disabled={user.onPremisesSyncEnabled ? true : false}
                  error={
                    formik.touched.startUserPrincipalName &&
                    formik.errors.startUserPrincipalName
                  }
                  sx={{
                    mb: 2,
                    mr: 0,
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": {
                        borderRight: "none",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">@</InputAdornment>
                    ),
                  }}
                ></TextField>
              </Tooltip>
              <Tooltip title="Cannot be edited. AD-Synced user.">
                <TextField
                  id="endUserPrincipalName"
                  select={true}
                  required={true}
                  value={formik.values.endUserPrincipalName}
                  onChange={formik.handleChange}
                  disabled={user.onPremisesSyncEnabled ? true : false}
                  error={
                    formik.touched.endUserPrincipalName &&
                    formik.errors.endUserPrincipalName
                  }
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      "& > fieldset": {
                        borderLeft: "none",
                        borderTopLeftRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      },
                    },
                  }}
                >
                  {verifiedDomains.map((domain, i) => (
                    <MenuItem value={domain.id} key={i}>
                      {domain.id}
                    </MenuItem>
                  ))}{" "}
                </TextField>
              </Tooltip>
            </FormGroup>
            <FormGroup row={true}>
              <TextField
                id="firstName"
                label="First name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && formik.errors.firstName}
                sx={{ mr: 2 }}
              />
              <TextField
                id="lastName"
                label="Last name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && formik.errors.lastName}
                sx={{ mb: 2 }}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="displayName"
                label="Display name"
                required={true}
                value={formik.values.displayName}
                onChange={formik.handleChange}
                error={formik.touched.displayName && formik.errors.displayName}
                sx={{ mb: 2 }}
              />
            </FormGroup>
            <Button type="submit" variant="contained" endIcon={<Save />}>
              Save changes
            </Button>
          </FormControl>
        </form>
      </Box>
    </Paper>
  );
}
