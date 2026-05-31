import CalendarClient from "./client";
import { getCalendarProjects } from "./actions";

export default async function CalendarView() {
  const projects = await getCalendarProjects();
  return <CalendarClient projects={projects} />;
}
