import {
  CircularProgress,
  TextField,
  Autocomplete,
  Skeleton,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import useSWR from "swr";
import { TenantContext } from "../utils/TenantContext";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function TenantSearch() {
  const [tenant, setTenant] = useContext(TenantContext);
  const { data, error } = useSWR("/api/tenants", fetcher);
  if (!data)
    return (
      <Box
        sx={{ margintop: 2 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  if (error) return <div>Error..</div>;

  return (
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
