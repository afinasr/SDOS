import { getCalendarData } from "./actions";
import CalendarClient from "./client";

export default async function CalendarView() {
  const data = await getCalendarData();
  return <CalendarClient initialData={data} />;
}
