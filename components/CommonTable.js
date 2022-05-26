import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { TextField, InputAdornment, Box } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";

export default function CommonTable({
  title,
  data,
  columns,
  actions,
  error,
  exportFileName,
  ...props
}) {
  return (
    <MaterialTable
      title={title}
      data={data}
      columns={columns}
      actions={actions}
      isLoading={!data}
      error={error}
      style={{ overflowWrap: "break-word" }}
      options={{
        columnResizable: true,
        columnsButton: true,
        filtering: true,
        pageSize: 10,
        actionsColumnIndex: -1,
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
