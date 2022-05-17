import { TextField, Autocomplete, Skeleton } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import { useSelector, useDispatch } from "react-redux";
import { setTenant } from "../features/tenantSlice";

export default function TenantSearch() {
  const tenant = useSelector((state) => state.tenant.value);
  const dispatch = useDispatch();

  const [value, setValue] = useState(tenant);
  const [inputValue, setInputValue] = useState("");

  const { data, error } = useSWR("/api/tenants", fetcher);

  if (error) {
    return <div>Error loading tenants..</div>;
  }

  const getSelectedOption = () => {
    if (tenant && data) {
      return data.find(
        (foundTenant) => foundTenant.displayName === tenant.displayName
      );
    } else {
      return null;
    }
  };

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
      autoSelect
      disablePortal
      id="tenant-search"
      autoHighlight
      options={data}
      getOptionLabel={(option) => option.displayName}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.customerId}>
            {option.displayName}
          </li>
        );
      }}
      value={getSelectedOption()}
      inputValue={inputValue}
      loading={!data}
      renderInput={(params) => (
        <TextField {...params} label="Select a tenant" />
      )}
      onChange={(event, value) => {
        setValue(value);
        dispatch(setTenant(value));
      }}
      onInputChange={(event, value) => {
        setInputValue(value);
      }}
      sx={{ marginTop: 2, marginLeft: 1, marginRight: 1 }}
      isOptionEqualToValue={(option, value) => {
        return option.customerId === value.customerId;
      }}
    />
  );
}
