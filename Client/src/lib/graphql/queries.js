// import { GraphQLClient /*gql*/ } from "graphql-request";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { getAccessToken } from "../auth";

// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   // the headers is set to a function because if it is an object it will be set initially when the component loads and never change
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return {
//         Authorization: `Bearer ${accessToken}`,
//       };
//     }
//     return {};
//   },
// });

const apolloClient = new ApolloClient({
  uri: "http://localhost:9000/graphql",
  cache: new InMemoryCache(),
});

export async function getJobs() {
  const query = gql`
    query Jobs {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;

  // const { jobs } = await client.request(query);
  const result = await apolloClient.query({ query: query });
  return result.data.jobs;
  // return jobs;
}

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        date
        title
        description
        company {
          id
          name
        }
      }
    }
  `;
  // const { job } = await client.request(query, { id });
  // return job;

  const result = await apolloClient.query({
    query: query,
    variables: { id: id },
  });
  return result.data.job;
}

export async function getCompany(id) {
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `;
  // const { company } = await client.request(query, { id });
  // return company;

  const result = await apolloClient.query({
    query: query,
    variables: { id: id },
  });
  return result.data.company;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;
  // const { job } = await client.request(mutation, {
  //   input: { title, description },
  // });
  // return job;
  const result = await apolloClient.mutate({
    mutation: mutation,
    variables: { input: { title, description } },
  });
  return result.data.job;
}
