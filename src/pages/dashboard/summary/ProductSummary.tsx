import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductSummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/summary/product/${id}`).then((res) => setSummary(res.data));
  }, [id]);

  if (!summary) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Summary</h2>
      <pre>{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
};

export default ProductSummaryPage;
