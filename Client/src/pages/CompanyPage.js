import { useParams } from "react-router";
// import { useState, useEffect } from "react";
import { CompanyById, getCompany } from "../lib/graphql/queries";
import JobList from "../components/JobList";
import { useQuery } from "@apollo/client";

function CompanyPage() {
  const { companyId } = useParams();

  const {data, loading, error} = useQuery(CompanyById, {variables: {id: companyId}})

  // const [state, setState] = useState({
  //   loading: true,
  //   error: false,
  //   company: null,
  // });

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const company = await getCompany(companyId);
  //       setState({
  //         loading: false,
  //         error: false,
  //         company,
  //       });
  //     } catch  {
  //       setState({
  //         loading: false,
  //         error: true,
  //         company: null,
  //       });
  //     }
  //   })();
  // }, [companyId]);

  // const {company, loading, error} = state;
  // console.log(company, loading, error);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="has-text-danger">Something went wrong</div>;
  }
  const {company} = data;
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
