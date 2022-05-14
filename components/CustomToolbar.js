import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

export function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        printOptions={{ disableToolbarButton: true }}
        csvOptions={{ utf8WithBom: true, fileName: "MSPartnerApp_Export" }}
      />
    </GridToolbarContainer>
  );
}
