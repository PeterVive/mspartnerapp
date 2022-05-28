import { useEffect } from "react";
import { Typography } from "@mui/material";
import { setTenant } from "../../../features/tenantSlice";
import useSWR from "swr";
import { Products } from "../../../utils/SKUList";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../../../components/CommonTable";
import { Check, Close, Edit } from "@mui/icons-material/";
import { useRouter } from "next/router";
import { uniq, map } from "lodash";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import type {
  AssignedLicense,
  User,
} from "@microsoft/microsoft-graph-types-beta";

type ExtendedUser = Partial<User> & { displayableLicenses: string[] | string };

export default function Users() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tenantId } = router.query;

  const { data: session, status } = useSession({
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

  const { data: users, error } = useSWR<ExtendedUser[]>(
    tenant
      ? `/api/tenants/${tenant.customerId}/users?select=id,userPrincipalName,displayName,assignedLicenses,userType,accountEnabled,onPremisesSyncEnabled`
      : null
  );

  interface cachedLicense {
    GUID: string;
    Product_Display_Name: string;
  }
  const licenseCache: cachedLicense[] = [];

  if (users) {
    // Fix various properties for proper table usage.
    users.forEach((user: ExtendedUser) => {
      // Set undefined or null to false, for table lookup.
      if (!user.onPremisesSyncEnabled) {
        user.onPremisesSyncEnabled = false;
      }
      // Combine licensing array to a string.
      const allLicenses: string[] = [];
      if (user.assignedLicenses) {
        user.assignedLicenses.forEach((assignedLicense: AssignedLicense) => {
          if (assignedLicense.skuId) {
            let product: cachedLicense | undefined;
            product = licenseCache.find(
              (product) => product.GUID === assignedLicense.skuId
            );
            if (!product) {
              product = Products.find(
                (product) => product.GUID === assignedLicense.skuId
              );
              if (product) {
                licenseCache.push(product);
                allLicenses.push(product.Product_Display_Name);
              }
            }
          }
          user.displayableLicenses = allLicenses;
        });
      }
    });
  }

  // Create lookup object of user types
  const uniqueUserTypes = Object.fromEntries(
    uniq(map(users, "userType")).map((e) => [e, e])
  );

  // Use license cache to create lookup object with license names
  let uniqueLicenses: any = licenseCache.map(
    (license) => license.Product_Display_Name
  );

  // Convert lookup object to correct format and add unlicensed option
  uniqueLicenses = uniqueLicenses.reduce(
    (accumulator: object, value: string) => {
      return { ...accumulator, [value]: [value][0] };
    },
    {}
  );
  uniqueLicenses[""] = "Unlicensed";

  const columns = [
    {
      title: "Account enabled",
      field: "accountEnabled",
      hidden: true,
      render: (rowData: User) =>
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
      lookup: uniqueUserTypes,
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
      field: "displayableLicenses",
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
            if (
              appliedFilter == "" &&
              rowData.displayableLicenses.length == 0
            ) {
              filterTest = true;
            }
            // Actual license filtering
            if (rowData.displayableLicenses.includes(appliedFilter)) {
              filterTest = true;
            }
          });
        }
        return filterTest;
      },
      render: (rowData: ExtendedUser) => (
        <div>
          {rowData.displayableLicenses?.length > 0 &&
          Array.isArray(rowData.displayableLicenses)
            ? rowData.displayableLicenses.join(" + ")
            : "Unlicensed"}
        </div>
      ),
      exportTransformer: (row: ExtendedUser) => {
        if (users) {
          // Find the user object of the current row.
          var foundUser = users.find((user: ExtendedUser) => {
            return user.userPrincipalName === row.userPrincipalName;
          });
          if (Array.isArray(foundUser!.displayableLicenses)) {
            // Return the license string instead of displayableLicenses array
            return (row.displayableLicenses =
              foundUser!.displayableLicenses.join(" + "));
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
