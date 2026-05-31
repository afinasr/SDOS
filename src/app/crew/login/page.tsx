"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CrewLogin() {
  const [pin, setPin] = useState(["", "", "", ""]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-sm bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] shadow-sm text-center space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">Crew Login</h1>
          <p className="text-gray-500 mt-2 text-sm">Enter your 4-digit studio PIN</p>
        </div>

        <div className="flex justify-center gap-3">
          {pin.map((digit, i) => (
            <input
              key={i}
              type="password"
              maxLength={1}
              className="w-14 h-14 text-center text-2xl font-semibold bg-gray-100 dark:bg-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={digit}
              onChange={(e) => {
                const newPin = [...pin];
                newPin[i] = e.target.value;
                setPin(newPin);
                // focus next input logic would go here
              }}
            />
          ))}
        </div>

        <Button className="w-full rounded-full py-6 text-lg font-medium">Verify PIN</Button>
      </div>
    </div>
  );
}
