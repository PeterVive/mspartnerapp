import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { TextField, InputAdornment, Box } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";

export default function CommonTable({
  title,
  data,
  columns,
  error,
  exportFileName,
  ...props
}) {
  return (
    <MaterialTable
      title={title}
      data={data}
      columns={columns}
      isLoading={!data}
      error={error}
      style={{ overflowWrap: "break-word" }}
      options={{
        tableLayout: "fixed",
        columnResizable: true,
        columnsButton: true,
        filtering: true,
        pageSize: 10,
        exportMenu: [
          {
            label: "Export PDF",
            exportFunc: (cols, datas) =>
              ExportPdf(
                cols,
                datas,
                `${exportFileName} ${title} ${new Date().toLocaleDateString()}`
              ),
          },
          {
            label: "Export CSV",
            exportFunc: (cols, datas) =>
              ExportCsv(
                cols,
                datas,
                `${exportFileName} ${title} ${new Date().toLocaleDateString()}`
              ),
          },
        ],
        exportAllData: true,
      }}
    />
  );
}
