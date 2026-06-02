import { getPipelineData } from "./actions";
import PipelineClient from "./client";

export default async function PipelineView() {
  const data = await getPipelineData();
  return <PipelineClient initialData={data} />;
}
