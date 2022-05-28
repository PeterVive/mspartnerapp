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
  SnackbarCloseReason,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { Save } from "@mui/icons-material/";
import { useFormik } from "formik";
import type {
  User,
  Domain,
  Contract,
} from "@microsoft/microsoft-graph-types-beta";

type UserEditProps = {
  user: User;
  domains: Domain[];
  tenant: Contract;
};

export default function UserEdit({ user, domains, tenant }: UserEditProps) {
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const formik = useFormik({
    initialValues: {
      startUserPrincipalName: user.userPrincipalName!.split("@")[0],
      endUserPrincipalName: user.userPrincipalName!.split("@")[1],
      givenName: user.givenName,
      surname: user.surname,
      displayName: user.displayName,
    },
    onSubmit: async (values, { setErrors }) => {
      const body = {
        userPrincipalName: `${values.startUserPrincipalName}@${values.endUserPrincipalName}`,
        firstName: values.givenName,
        surname: values.surname,
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
      } catch (error: any) {
        setSubmitError(error.error);
        setOpenErrorSnackbar(true);
      }
    },
  });

  const verifiedDomains: Domain[] = [];
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
        onClose={(
          event: Event | SyntheticEvent<any, Event>,
          reason: SnackbarCloseReason
        ): void => {
          if (reason === "clickaway") {
            return;
          }
          setOpenSuccessSnackbar(false);
        }}
      >
        <Alert
          onClose={(event: SyntheticEvent<Element, Event>): void => {
            setOpenSuccessSnackbar(false);
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully saved changes
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={(
          event: Event | SyntheticEvent<any, Event>,
          reason: SnackbarCloseReason
        ): void => {
          setOpenErrorSnackbar(false);
        }}
      >
        <Alert
          onClose={(event: SyntheticEvent<Element, Event>): void => {
            setOpenErrorSnackbar(false);
          }}
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
              <Tooltip
                title={
                  user.onPremisesSyncEnabled
                    ? "Cannot be edited. AD-Synced user."
                    : ""
                }
              >
                <TextField
                  id="startUserPrincipalName"
                  label="User principal name"
                  required={true}
                  value={formik.values.startUserPrincipalName}
                  onChange={formik.handleChange}
                  disabled={user.onPremisesSyncEnabled ? true : false}
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
              <Tooltip
                title={
                  user.onPremisesSyncEnabled
                    ? "Cannot be edited. AD-Synced user."
                    : ""
                }
              >
                <TextField
                  id="endUserPrincipalName"
                  select={true}
                  required={true}
                  value={formik.values.endUserPrincipalName}
                  onChange={formik.handleChange}
                  disabled={user.onPremisesSyncEnabled ? true : false}
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
                id="givenName"
                label="First name"
                value={formik.values.givenName}
                onChange={formik.handleChange}
                sx={{ mr: 2 }}
              />
              <TextField
                id="surname"
                label="Last name"
                value={formik.values.surname}
                onChange={formik.handleChange}
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
