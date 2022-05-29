import MaterialTable, {
  Action,
  MaterialTableProps,
  Options,
} from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { TextField, InputAdornment, Box } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";

export interface CommonTableProps<T extends object>
  extends MaterialTableProps<T> {
  error: any;
  exportFileName: string;
}

const CommonTable: <T extends object>(
  props: CommonTableProps<T>
) => JSX.Element = <T extends object>({
  title,
  exportFileName,
  ...props
}: CommonTableProps<T>) => {
  const options: Options<T> = Object.assign(props.options || {}, {
    columnResizable: true,
    columnsButton: true,
    filtering: true,
    pageSize: 10,
    actionsColumnIndex: -1,
    exportMenu: [
      {
        label: "Export PDF",
        exportFunc: (cols: any, datas: any) =>
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
  });

  return (
    <MaterialTable
      title={title}
      style={{ overflowWrap: "break-word" }}
      options={options}
      localization={{
        header: {
          actions: "",
        },
      }}
      {...props}
    />
  );
};

export default CommonTable;
