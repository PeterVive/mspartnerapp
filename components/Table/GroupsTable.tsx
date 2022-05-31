import type { Contract } from "@microsoft/microsoft-graph-types-beta";
import { useState, useMemo } from "react";
import type { ExtendedGroup } from "../../utils/customGraphTypes";
import CommonTable from "./CommonTable";

type GroupsTableProps = {
  groups: ExtendedGroup[] | undefined;
  tenant: Contract;
};

export default function GroupTable({ groups, tenant }: GroupsTableProps) {
  const [rows, setRows] = useState<ExtendedGroup[] | undefined>(groups);
  const [columns, setColumns] = useState<any>([
    { title: "Display name", field: "displayName" },
    { title: "Mail", field: "mail" },
    {
      title: "Type",
      field: "foundGroupType",
      lookup: {
        "Microsoft 365": "Microsoft 365",
        Security: "Security",
        "Mail-enabled security": "Mail-enabled security",
        Distribution: "Distribution",
      },
    },
  ]);

  useMemo(() => {
    if (groups) {
      groups.forEach((group) => {
        if (!group.foundGroupType) {
          if (group.groupTypes?.includes("Unified")) {
            group.foundGroupType = "Microsoft 365";
          } else if (!group.mailEnabled && group.securityEnabled) {
            group.foundGroupType = "Security";
          } else if (group.mailEnabled && group.securityEnabled) {
            group.foundGroupType = "Mail-enabled security";
          } else if (group.mailEnabled && !group.securityEnabled) {
            group.foundGroupType = "Distribution";
          }
        }
        setRows(groups);
      });
    }
  }, [groups]);

  return (
    <CommonTable
      title={"Groups"}
      isLoading={!groups}
      data={rows ? rows : []}
      columns={columns}
      exportFileName={tenant.displayName!.toString()}
    />
  );
}
