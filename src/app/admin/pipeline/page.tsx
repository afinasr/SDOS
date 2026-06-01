import { getPipelineProjects } from "./actions";
import PipelineClient from "./client";

export default async function PipelineView() {
  const projects = await getPipelineProjects();
  return <PipelineClient initialProjects={projects} />;
}
