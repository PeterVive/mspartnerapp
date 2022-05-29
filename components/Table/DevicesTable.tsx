import type {
  Contract,
  ManagedDevice,
} from "@microsoft/microsoft-graph-types-beta";
import { useState, useEffect } from "react";
import CommonTable from "./CommonTable";

type DevicesTableProps = {
  devices: ManagedDevice[] | undefined;
  tenant: Contract;
};

export default function DevicesTable({ devices, tenant }: DevicesTableProps) {
  const [rows, setRows] = useState<ManagedDevice[] | undefined>(devices);
  const [columns, setColumns] = useState<any>([
    { title: "Name", field: "deviceName" },
    { title: "Associated user", field: "userId" },
    {
      title: "Ownership",
      field: "ownerType",
      lookup: {
        company: "Company",
        personal: "Personal",
        unknown: "Unknown",
      },
    },
    {
      title: "Last sync",
      field: "lastSyncDateTime",
      type: "datetime",
    },
  ]);

  useEffect(() => {
    if (devices) {
      devices.forEach((device) => {
        // If undefined, means the device is just Azure AD registrered.
        if (!device.ownerType) {
          device.ownerType = "unknown";
        }
      });
      setRows(devices);
    }
  }, [devices, columns]);

  return (
    <CommonTable
      title={"Devices"}
      isLoading={!devices}
      data={rows ? rows : []}
      columns={columns}
      exportFileName={tenant.displayName!.toString()}
    />
  );
}
