require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmYXR1ZmppdmxpZHR5dGZrZnVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyMzUxMiwiZXhwIjoyMDk1Nzk5NTEyfQ.apM4g3PjzKW0VaiX_giEkaR0s4cYmXqLa8YoAEvxfD8'
);

const mockProjects = [
  { title: "Meera & Dev", client_name: "Meera & Dev", event_date: "2026-07-21", location: "Umaid Bhawan Palace, Jodhpur", event_type: "Destination Wedding", status: "Lead", total_value: 0 },
  { title: "Nisha & Karan", client_name: "Nisha & Karan", event_date: "2026-05-25", location: "ITC Grand Chola, Chennai", event_type: "Engagement", status: "Lead", total_value: 0 },
  { title: "Kavya & Aryan", client_name: "Kavya & Aryan", event_date: "2026-07-06", location: "Taj Mahal Hotel, Delhi", event_type: "Wedding", status: "Proposal Sent", total_value: 80000 },
  { title: "Aisha & Rohan", client_name: "Aisha & Rohan", event_date: "2026-06-06", location: "The Leela Palace, Mumbai", event_type: "Wedding", status: "Active", total_value: 120000 },
  { title: "Pooja & Vikram", client_name: "Pooja & Vikram", event_date: "2026-05-02", location: "Radisson Blu, Bangalore", event_type: "Wedding", status: "Awaiting Selection", total_value: 88000 },
];

async function seed() {
  console.log("Seeding Database...");
  const { data, error } = await supabase.from('projects').insert(mockProjects).select();
  
  if (error) {
    console.error("Error seeding:", error.message);
  } else {
    console.log("Successfully seeded projects!", data.length);
  }
}

seed();
