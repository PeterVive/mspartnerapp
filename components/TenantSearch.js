import {
  Alert,
  AlertTitle,
  TextField,
  Autocomplete,
  Skeleton,
} from "@mui/material";
import React, { useContext } from "react";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import { TenantContext } from "../utils/TenantContext";

export default function TenantSearch() {
  const [tenant, setTenant] = useContext(TenantContext);
  const { data, error } = useSWR("/api/tenants", fetcher);

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error loading tenants!</AlertTitle>
      </Alert>
    );
  }

  return !data ? (
    <Skeleton
      variant="rectangular"
      sx={{ marginTop: 2, marginLeft: 1, marginRight: 1 }}
      width="100%"
    >
      <TextField fullWidth label="Select a tenant" />
    </Skeleton>
  ) : (
    <Autocomplete
      disablePortal
      id="tenant-search"
      options={data}
      getOptionLabel={(option) => option.displayName}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.customerId}>
            {option.displayName}
          </li>
        );
      }}
      loading={!data}
      renderInput={(params) => (
        <TextField {...params} label="Select a tenant" />
      )}
      onChange={(event, value) => {
        setTenant(value);
      }}
      sx={{ marginTop: 2, marginLeft: 1, marginRight: 1 }}
      isOptionEqualToValue={(option, value) => {
        return option.customerId === value.customerId;
      }}
    />
  );
}
