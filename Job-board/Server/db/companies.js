import { connection } from "./connection.js";
import dataLoader from "dataloader";
const getCompanyTable = () => connection.table("company");

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

// export const companyLoader = new dataLoader(async (ids) => {
//   const companies = await getCompanyTable().select().whereIn("id", ids);
//   return ids.map((id) => companies.find((company) => company.id === id));
// });

export function createCompanyLoader() {
  return new dataLoader(async (ids) => {
    const companies = await getCompanyTable().select().whereIn("id", ids);
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}