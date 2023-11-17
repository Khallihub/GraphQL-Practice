// import { GraphQLClient /*gql*/ } from "graphql-request";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  concat,
  createHttpLink,
  gql,
} from "@apollo/client";
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

const httpLink = createHttpLink({
  uri: "http://localhost:9000/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return forward(operation);
  }
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   }
  // }
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    description
    company {
      id
      name
    }
  }
`;

export const CompanyById = gql`
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

const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

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
  // return jobs;
  const result = await apolloClient.query({
    query: query,
    fetchPolicy: "network-only",
  });
  return result.data.jobs;
}

export async function getJob(id) {
  // const { job } = await client.request(query, { id });
  // return job;

  const result = await apolloClient.query({
    query: jobByIdQuery,
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
        ...JobDetail
      }
      ${jobDetailFragment}
    }
  `;
  // const { job } = await client.request(mutation, {
  //   input: { title, description },
  // });
  // return job;
  const result = await apolloClient.mutate({
    mutation: mutation,
    variables: { input: { title, description } },
    // writing data to cache after mutation is done without refetching
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return result.data.job;
}
