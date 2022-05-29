import { useEffect } from "react";
import { Typography } from "@mui/material";
import { setTenant } from "../../../features/tenantSlice";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../../../components/CommonTable";
import { Check, Close, Edit } from "@mui/icons-material/";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import { getUserLicensingObjects } from "../../../utils/licenseLookup";
import type { ExtendedUser } from "../../../utils/customGraphTypes";
export default function Users() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tenantId } = router.query;

  useSession({
    required: true,
  });

  const tenant = useAppSelector((state) => state.tenant.value);

  // Load tenantData if Tenant is not set in store, but is in query parameter.
  const { data: tenantData, error: tenantError } = useSWR(
    !tenant && tenantId ? `/api/tenants/${tenantId}/` : null
  );

  useEffect(() => {
    // When tenanData has loaded, set the state in store to update other components.
    if (tenantData) {
      dispatch(setTenant(tenantData));
    }

    // When tenant state in store is set, push the current tenant to URL.
    if (tenant) {
      const desiredURL = `/${tenant.customerId}/users`;
      if (router.asPath !== desiredURL) {
        router.push(desiredURL, undefined, {
          shallow: true,
        });
      }
    }
  });

  let { data: users, error } = useSWR<ExtendedUser[]>(
    tenant
      ? `/api/tenants/${tenant.customerId}/users?select=id,userPrincipalName,displayName,assignedLicenses,userType,accountEnabled,onPremisesSyncEnabled`
      : null
  );

  let uniqueLicenses;
  if (users) {
    // Fix various properties for proper table usage.
    users.forEach((user) => {
      // Set undefined or null to false, for table lookup.
      if (!user.onPremisesSyncEnabled) {
        user.onPremisesSyncEnabled = false;
      }
    });
    // Set users licenseNames and get lookup object.
    const { users: modifiedUsers, licenseLookupObject } =
      getUserLicensingObjects(users);
    users = modifiedUsers;
    uniqueLicenses = licenseLookupObject;
  }

  const columns = [
    {
      title: "Account enabled",
      field: "accountEnabled",
      hidden: true,
      render: (rowData: ExtendedUser) =>
        rowData.accountEnabled ? <Check /> : <Close />,
      lookup: {
        true: "Yes",
        false: "No",
      },
    },
    {
      title: "Type",
      field: "userType",
      hidden: true,
      lookup: {
        Member: "Member",
        Guest: "Guest",
      },
    },
    {
      title: "UPN",
      field: "userPrincipalName",
    },
    {
      title: "Display name",
      field: "displayName",
    },
    {
      title: "Licenses",
      field: "licenseNames",
      lookup: uniqueLicenses,
      customFilterAndSearch: (filter: string | [], rowData: ExtendedUser) => {
        let filterTest = false;
        // If no filter is selected
        if (filter.length == 0) {
          return true;
        }
        if (typeof filter === "string") {
          // This enables global search to use the default mechanism :)
          return false;
        } else {
          filter.forEach((appliedFilter) => {
            // If unlicensed filter selected
            if (appliedFilter == "" && rowData.licenseNames.length == 0) {
              filterTest = true;
            }
            // Actual license filtering
            if (rowData.licenseNames.includes(appliedFilter)) {
              filterTest = true;
            }
          });
        }
        return filterTest;
      },
      render: (rowData: ExtendedUser) => (
        <div>
          {Array.isArray(rowData.licenseNames) &&
          rowData.licenseNames.length > 0
            ? rowData.licenseNames.join(" + ")
            : "Unlicensed"}
        </div>
      ),
      exportTransformer: (row: ExtendedUser) => {
        if (users) {
          // Find the user object of the current row.
          var foundUser = users.find((user: ExtendedUser) => {
            return user.userPrincipalName === row.userPrincipalName;
          });
          if (Array.isArray(foundUser!.licenseNames)) {
            // Return the license string instead of licenseNames array
            return (row.licenseNames = foundUser!.licenseNames.join(" + "));
          }
        }
      },
    },
    {
      title: "AD-Synced",
      field: "onPremisesSyncEnabled",
      render: (rowData: ExtendedUser) =>
        rowData.onPremisesSyncEnabled ? <Check /> : <Close />,
      lookup: {
        true: "Yes",
        false: "No",
      },
    },
  ];
  const actions = [
    {
      icon: () => <Edit />,
      tooltip: "Edit User",
      onClick: (event: any, rowData: ExtendedUser | ExtendedUser[]) => {
        // we dont allow bulk editing, yet.
        if (!Array.isArray(rowData)) {
          router.push(`/${tenantId}/users/${rowData.id}/edit`);
        }
      },
    },
  ];

  let content;

  if (!tenant) {
    content = (
      <>
        <Typography variant="h4" component="h1" gutterBottom>
          No tenant selected.
        </Typography>
      </>
    );
  } else {
    content = (
      <>
        <Head>
          <title>{tenant.displayName} - Users</title>
          <meta
            property="og:title"
            content={tenant.displayName + " Users"}
            key="title"
          />
        </Head>
        <CommonTable
          title={"Users"}
          isLoading={!users}
          data={users ? users : []}
          columns={columns}
          actions={actions}
          error={error}
          exportFileName={tenant.displayName!.toString()}
        />
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
