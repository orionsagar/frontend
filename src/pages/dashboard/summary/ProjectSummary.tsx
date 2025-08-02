import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProjectSummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/summary/project/${id}`).then((res) => setSummary(res.data));
  }, [id]);

  if (!summary) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Project Summary</h2>
      <pre>{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
};

export default ProjectSummaryPage;
