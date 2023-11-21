import { useMutation, useQuery } from "@apollo/client";
import {
  companyById,
  createJobMutation,
  jobByIdQuery,
  jobsQuery,
} from "./queries";

export function useCompany(companyId) {
  const { data, loading, error } = useQuery(companyById, {
    variables: { id: companyId },
  });
  return { company: data?.company, loading, error: Boolean(error) };
}

export function useJob(jobId) {
  const { data, loading, error } = useQuery(jobByIdQuery, {
    variables: { id: jobId },
  });
  return { job: data?.job, loading, error: Boolean(error) };
}
export function useJobs(limit, offset) {
  const { data, loading, error } = useQuery(jobsQuery, {
    variables: { limit, offset },
    fetchPolicy: "network-only",
  });
  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

export function useCreateJob() {
  const [mutate, { loading, error }] = useMutation(createJobMutation);
  if (error) {
    console.log(error);
  }
  const createJob = async (title, description) => {
    const {
      data: { job },
    } = await mutate({
      variables: {
        input: { title, description },
      },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });
    return job;
  };
  return {
    createJob,
    loading,
  };
}
