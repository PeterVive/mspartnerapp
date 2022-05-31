import MaterialTable, {
  MaterialTableProps,
  Options,
} from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";

export interface ReportsTableProps<T extends object>
  extends MaterialTableProps<T> {
  exportFileName: string;
}

const ReportsTable: <T extends object>(
  props: ReportsTableProps<T>
) => JSX.Element = <T extends object>({
  title,
  exportFileName,
  ...props
}: ReportsTableProps<T>) => {
  const options: Options<T> = Object.assign(props.options || {}, {
    columnResizable: true,
    columnsButton: true,
    filtering: false,
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

export default ReportsTable;
