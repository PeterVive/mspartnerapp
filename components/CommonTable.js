import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Box } from "@mui/system";
import { TextField, InputAdornment } from "@mui/material";
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
      }}
      components={{
        FilterRow: (rowProps) => {
          const { columns, onFilterChanged } = rowProps;

          return (
            <>
              <tr>
                {columns.map((col) => {
                  if (col.field) {
                    return (
                      <td key={col.tableData.id}>
                        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                          <TextField
                            id={col.field}
                            onChange={(e) => {
                              console.log(e.target.id, e.target.value);
                              onFilterChanged(col.tableData.id, e.target.value);
                            }}
                            placeholder={"Filter.."}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FilterAlt />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ mb: 1, ml: 1 }}
                            variant="standard"
                          />
                        </Box>
                      </td>
                    );
                  }
                })}
              </tr>
            </>
          );
        },
      }}
    />
  );
}
