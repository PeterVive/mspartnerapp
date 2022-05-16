import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";

export default function CommonTable({ title, data, columns, error }) {
  return (
    <MaterialTable
      title={title}
      data={data}
      columns={columns}
      isLoading={!data}
      error={error}
      options={{
        tableLayout: "fixed",
        columnResizable: true,
        columnsButton: true,
        pageSize: 10,
        exportMenu: [
          {
            label: "Export PDF",
            exportFunc: (cols, datas) =>
              ExportPdf(
                cols,
                datas,
                `${
                  tenant.displayName
                } ${title} ${new Date().toLocaleDateString()}`
              ),
          },
          {
            label: "Export CSV",
            exportFunc: (cols, datas) =>
              ExportCsv(
                cols,
                datas,
                `${
                  tenant.displayName
                } ${title} ${new Date().toLocaleDateString()}`
              ),
          },
        ],
      }}
    />
  );
}
