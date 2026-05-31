import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PortalOverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif mb-2">Welcome, Jane!</h2>
        <p className="text-gray-500">Your wedding project timeline and deliverables are managed here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proposal & Contract</CardTitle>
          <CardDescription>Review and sign to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full sm:w-auto">View Proposal</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Next payment due: Advance Booking (₹50,000)</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full sm:w-auto">Pay via Razorpay</Button>
        </CardContent>
      </Card>
    </div>
  );
}
