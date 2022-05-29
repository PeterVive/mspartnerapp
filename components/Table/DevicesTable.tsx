import type { Contract, Device } from "@microsoft/microsoft-graph-types-beta";
import { useState, useEffect } from "react";
import CommonTable from "./CommonTable";

type DevicesTableProps = {
  devices: Device[] | undefined;
  tenant: Contract;
  error?: any;
};

export default function DevicesTable({
  devices,
  tenant,
  error,
}: DevicesTableProps) {
  const [rows, setRows] = useState<Device[] | undefined>(devices);
  const [columns, setColumns] = useState<any>([
    { title: "Display name", field: "displayName" },
    { title: "Manufacturer", field: "manufacturer" },
    { title: "Model", field: "model" },
    {
      title: "Enrollment type",
      field: "enrollmentType",
      lookup: {
        OnPremiseCoManaged: "Azure AD Hybrid-joined",
        AzureDomainJoined: "Azure AD Joined",
        Registrered: "Registrered",
      },
    },
  ]);

  useEffect(() => {
    if (devices) {
      devices.forEach((device) => {
        // If undefined, means the device is just Azure AD registrered.
        if (!device.enrollmentType) {
          device.enrollmentType = "Registrered";
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
      error={error}
      columns={columns}
      exportFileName={tenant.displayName!.toString()}
    />
  );
}
