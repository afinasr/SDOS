"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function EnquiryFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-serif">Studio Name</h1>
          <p className="text-blue-100 mt-1">Book your dream shoot</p>
        </div>
        <form className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Jane Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="jane@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Event Date</Label>
            <Input id="date" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <select id="type" className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300">
              <option>Wedding</option>
              <option>Pre-Wedding</option>
              <option>Engagement</option>
              <option>Maternity</option>
            </select>
          </div>
          <Button type="button" className="w-full mt-4">Submit Enquiry</Button>
        </form>
      </motion.div>
    </div>
  );
}
