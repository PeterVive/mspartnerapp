import { User } from "@microsoft/microsoft-graph-types-beta";
import SKUList from "./SKUList.json";
import type { ExtendedUser } from "./customGraphTypes";

// Returns an array of license names for a given user
export function licenseLookup(user: User) {
  // Create an array of all license names.
  const userLicenses: string[] = [];
  // Loop through the user's licenses.
  user.assignedLicenses?.forEach((license) => {
    // If license has a skuId, look it up on the SKUList and add its product name to the array.
    if (license.skuId) {
      const licenseName = SKUList[license.skuId as keyof typeof SKUList];
      userLicenses.push(licenseName);
    }
  });
  return userLicenses;
}

type licenseLookupObject = {
  [key: string]: string | string[];
};

// Returns a material table lookup object for an array of users, and the users array with licenseNames added to each user.
export function getLicenseLookupObject(
  users: ExtendedUser[]
): licenseLookupObject {
  // Create a cache array to hold the unique licenses.
  const licenseNames: string[] = [];
  // Loop through the users.
  users.forEach((user) => {
    // Look up each users license and add it's name to the cache array if not there.
    if (Array.isArray(user.licenseNames)) {
      user.licenseNames.forEach((license) => {
        if (!licenseNames.includes(license)) {
          licenseNames.push(license);
        }
      });
    }
  });

  // Create a lookup object to hold the unique licenses for displaying in material table.
  let licenseLookupObject: licenseLookupObject = {};
  // Loop through the cache array, adding each license to the lookup object in the format "licenseName": "licenseName".
  licenseNames.forEach((license) => {
    licenseLookupObject = {
      ...licenseLookupObject,
      [license]: [license],
    };
  });
  licenseLookupObject[""] = "Unlicensed";
  return licenseLookupObject;
}
