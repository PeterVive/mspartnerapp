import type { Contract, Domain } from "@microsoft/microsoft-graph-types-beta";
import { Check, Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import CommonTable from "./CommonTable";

type DomainsTableProps = {
  domains: Domain[] | undefined;
  tenant: Contract;
  error?: any;
};

export default function DomainsTable({
  domains,
  tenant,
  error,
}: DomainsTableProps) {
  const [rows, setRows] = useState<Domain[] | undefined>(domains);
  const [columns, setColumns] = useState<any>([
    { title: "Domain name", field: "id" },
    {
      title: "Verified",
      field: "isVerified",
      lookup: {
        true: "Yes",
        false: "No",
      },
      render: (rowData: Domain) => (rowData.isVerified ? <Check /> : <Close />),
    },
  ]);

  useEffect(() => {
    if (domains) {
      setRows(domains);
    }
  }, [domains, columns]);

  return (
    <CommonTable
      title={"Domains"}
      isLoading={!domains}
      data={rows ? rows : []}
      columns={columns}
      exportFileName={tenant.displayName!.toString()}
    />
  );
}
