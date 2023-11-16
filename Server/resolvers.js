import { getJobs, getJob, getJobsByCompany } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";
import { GraphQLError } from "graphql";
export const resolvers = {
  Query: {
    job: async (_parent, { id }) => {
      const job = await getJob(id);
      if (!job) {
        notFoundErr(`Job not found with id: ${id}`);
      }
      return job;
    },
    jobs: async () => {
      const jobs = await getJobs();
      return jobs;
    },
    company: async (_parent, { id }) => {
      const company = await getCompany(id);
      if (!company) { 
        notFoundErr(`Company not found with id: ${id}`);
      }
      return company;
    },
  },
  Job: {
    company: (job) => {
      return getCompany(job.companyId);
    },
    date: (job) => job.createdAt.slice(0, "YYYY-MM-DD".length),
  },

  Company: {
    jobs: (company) => {
      return getJobsByCompany(company.id);
    },
  },
};

function notFoundErr(message) {
  throw new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}
