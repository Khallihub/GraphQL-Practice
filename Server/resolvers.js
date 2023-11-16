import { getJobs, getJob } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
export const resolvers = {
  Query: {
    job: async (_parent, { id }) => {
      const job = await getJob(id);
      return job;
    },
    jobs: async () => {
      const jobs = await getJobs();
      return jobs;
    },
    company: async (_parent, { id }) => {
      const company = await getCompany(id);
      return company;
    },
  },
  Job: {
    company: (job) => {
      return getCompany(job.companyId);
    },
    date: (job) => job.createdAt.slice(0, "YYYY-MM-DD".length),
  },
};
