import { /*useEffect*/ useState } from "react";
import JobList from "../components/JobList";
// import { getJobs } from "../lib/graphql/queries";
import { useJobs } from "../lib/graphql/hooks";
import PaginationBar from "../components/PaginationBar"

const JOBS_PER_PAGE = 5;

function HomePage() {
  // const [jobs, setJobs] = useState([]);

  // useEffect(() => {
  //   getJobs().then((jobs) => {
  //     setJobs(jobs);
  //   });
  // }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error } = useJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE
  );
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Something went wrong</div>;
  }
  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <div>
        {/* <button
          onClick={() => {
            setCurrentPage((cur) => cur - 1);
          }}
          disabled={true ? currentPage === 1 : false}
        >
          Previous
        </button>
        <span>{`${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => {
            setCurrentPage((cur) => cur + 1);
          }}
          disabled={true ? totalPages === currentPage : false}
        >
          Next
        </button> */}
      </div>
      <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
