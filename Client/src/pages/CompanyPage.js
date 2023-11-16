import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getCompany } from "../lib/graphql/queries";

function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    getCompany(companyId).then((company) => {
      setCompany(company);
    });
  }, [companyId]);

  if (!company) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
    </div>
  );
}

export default CompanyPage;
