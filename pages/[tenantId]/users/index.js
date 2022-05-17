import { useEffect } from "react";
import { Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setTenant } from "../../../features/tenantSlice";
import useSWR from "swr";
import { Products } from "../../../utils/SKUList";
import { useSession } from "next-auth/react";
import Head from "next/head";
import CommonTable from "../../../components/CommonTable";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material/";
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tenantId } = router.query;

  const { data: session, status } = useSession({
    required: true,
  });

  const tenant = useSelector((state) => state.tenant.value);

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

  const { data: users, error } = useSWR(
    tenant ? `/api/tenants/${tenant.customerId}/users` : null
  );

  if (users) {
    // Convert license data to more table-friendly format
    users.forEach((user) => {
      const allLicenses = [];
      user.assignedLicenses.forEach((assignedLicense) => {
        if (assignedLicense.skuId) {
          const product = Products.find(
            (product) => product.GUID === assignedLicense.skuId
          );
          allLicenses.push(product.Product_Display_Name);
        }
      });
      user.displayableLicenses = allLicenses.join(" + ");
    });
  }

  const columns = [
    {
      title: "Account enabled",
      field: "accountEnabled",
      hidden: true,
      render: (rowData) =>
        rowData.accountEnabled ? <CheckBox /> : <CheckBoxOutlineBlank />,
    },
    { title: "Type", field: "userType", hidden: true },
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
    },
    {
      title: "AD-Synced",
      field: "onPremisesSyncEnabled",
      render: (rowData) =>
        rowData.onPremisesSyncEnabled ? <CheckBox /> : <CheckBoxOutlineBlank />,
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
          data={users}
          columns={columns}
          error={error}
          exportFileName={tenant.displayName}
        />
      </>
    );
  }

  return <div style={{ height: "80vh", width: "100%" }}>{content}</div>;
}
