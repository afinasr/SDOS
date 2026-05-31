import InvoicesClient from "./client";
import { getInvoices, getActiveProjects } from "./actions";

export default async function InvoicesView() {
  const invoices = await getInvoices();
  const projects = await getActiveProjects();
  
  return <InvoicesClient initialInvoices={invoices} projects={projects} />;
}
