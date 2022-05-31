import type { Contract } from "@microsoft/microsoft-graph-types-beta";
import { useState, useEffect } from "react";
import ReportsTable from "../ReportsTable";

type ReportTableProps = {
  report: any;
  tenant: Contract;
};

export default function OutlookDesktopVersionReportTable({
  report,
  tenant,
}: ReportTableProps) {
  const [rows, setRows] = useState<any>(report);
  const [columns, setColumns] = useState<any>([
    {
      title: "Outlook M365",
      field: "Outlook M365",
    },
    {
      title: "Outlook 2019",
      field: "Outlook 2019",
    },
  ]);

  useEffect(() => {
    if (report) {
      setRows(report);
    }
  }, [report, columns]);

  return (
    <ReportsTable
      isLoading={!report}
      data={rows ? rows : []}
      columns={columns}
      options={{
        showTitle: false,
        search: false,
      }}
      exportFileName={tenant.displayName!.toString()}
    />
  );
}
