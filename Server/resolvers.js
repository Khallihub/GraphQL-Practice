import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
} from "./db/jobs.js";
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

  // Mutation: {
  //   createJob: async (_root, {title, description}) => {
  //     const companyId = "FjcJCHJALA4i";
  //     const job = await createJob({companyId,title, description})
  //     return job;
  //   }
  // },

  Mutation: {
    createJob: async (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw new unauthorizedError("You must be logged in to create a job");
      }
      const companyId = user.companyId;
      const job = await createJob({ companyId, title, description });
      return job;
    },

    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw new unauthorizedError("You must be logged in to delete a job");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw new notFoundErr(`Job not found with id: ${id}`);
      }
      return job;
    },

    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) {
        throw new unauthorizedError("You must be logged in to update a job");
      }
      const job = await updateJob({
        id,
        title,
        description,
        companyId: user.companyId,
      });
      return job;
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
function unauthorizedError(message) {
  throw new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
}
