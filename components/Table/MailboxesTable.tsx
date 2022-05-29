import { Contract } from "@microsoft/microsoft-graph-types-beta";
import { useState, useEffect } from "react";
import { Mailbox } from "../../utils/customGraphTypes";
import CommonTable from "./CommonTable";

type MailboxesTableProps = {
  mailboxes: Mailbox[] | undefined;
  tenant: Contract;
  error?: any;
};

export default function MailboxesTable({
  mailboxes,
  tenant,
  error,
}: MailboxesTableProps) {
  const [rows, setRows] = useState<Mailbox[] | undefined>();
  const [columns, setColumns] = useState<any>([
    { title: "UPN", field: "UserPrincipalName" },
    { title: "Display name", field: "DisplayName" },
    { title: "Alias", field: "Alias" },
    {
      title: "Type",
      field: "RecipientTypeDetails",
      lookup: {
        UserMailbox: "User",
        SharedMailbox: "Shared",
        RoomMailbox: "Room",
        EquipmentMailbox: "Equipment",
      },
    },
  ]);

  useEffect(() => {
    if (mailboxes) {
      // Remove DiscoverySearchMailbox
      let filteredMailboxes = mailboxes.filter(
        (mailbox: Mailbox) =>
          !mailbox.UserPrincipalName.startsWith("DiscoverySearchMailbox")
      );

      // Convert alias data to more table-friendly format
      filteredMailboxes.forEach((mailbox) => {
        const aliasList: string[] = [];
        mailbox.EmailAddresses.forEach((alias) => {
          if (alias.startsWith("smtp:")) {
            aliasList.push(alias.slice(5));
          }
        });
        mailbox.Alias = aliasList.join(",\r\n");
      });

      setRows(filteredMailboxes);
    }
  }, [mailboxes, columns]);

  return (
    <CommonTable
      title={"Mailboxes"}
      isLoading={!mailboxes}
      data={rows ? rows : []}
      error={error}
      columns={columns}
      exportFileName={tenant.displayName!.toString()}
    />
  );
}
