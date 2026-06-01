import InvoicesClient from "./client";
import { getInvoices, getActiveProjects, getTemplates } from "./actions";

export default async function InvoicesView() {
  const invoices = await getInvoices();
  const projects = await getActiveProjects();
  const templates = await getTemplates();
  
  return <InvoicesClient initialInvoices={invoices} projects={projects} initialTemplates={templates} />;
}
