import CrewClient from "./client";
import { getCrewMembers } from "./actions";

export default async function CrewView() {
  const crew = await getCrewMembers();
  return <CrewClient initialCrew={crew} />;
}
