import type { Contract } from "@microsoft/microsoft-graph-types-beta";
import { Check, Close, Edit } from "@mui/icons-material";
import router from "next/router";
import { useState, useEffect } from "react";
import { ExtendedUser } from "../../utils/customGraphTypes";
import { getLicenseLookupObject } from "../../utils/licenseLookup";
import CommonTable from "./CommonTable";

type UsersTableProps = {
  users: ExtendedUser[] | undefined;
  tenant: Contract;
};

export default function UsersTable({ users, tenant }: UsersTableProps) {
  const actions = [
    {
      icon: () => <Edit />,
      tooltip: "Edit User",
      onClick: (event: any, rowData: ExtendedUser | ExtendedUser[]) => {
        // we dont allow bulk editing, yet.
        if (!Array.isArray(rowData)) {
          router.push(`/${tenant.customerId}/users/${rowData.id}/edit`);
        }
      },
    },
  ];

  const [rows, setRows] = useState<ExtendedUser[] | undefined>(users);
  const [columns, setColumns] = useState<any>([
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
  ]);

  useEffect(() => {
    if (users) {
      // Fix various properties for proper table usage.
      users.forEach((user) => {
        // Set undefined or null to false, for table lookup.
        if (!user.onPremisesSyncEnabled) {
          user.onPremisesSyncEnabled = false;
        }
      });
      if (!columns[4].lookup) {
        const newColumns = [...columns];
        newColumns[4].lookup = getLicenseLookupObject(users);
        setColumns(newColumns);
      }
      // Set users licenseNames and get lookup object.
      if (!rows) {
        setRows(users);
      }
    }
  }, [users, columns, rows]);

  return (
    <CommonTable
      title={"Users"}
      isLoading={!users}
      data={rows ? rows : []}
      columns={columns}
      actions={actions}
      exportFileName={tenant.displayName!.toString()}
    />
  );
}
