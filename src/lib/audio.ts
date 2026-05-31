"use client";

// Very short, subtle base64 encoded audio strings for immediate, no-network-request UI feedback.
// In a real production app you would likely load these from a CDN, but embedding them is perfect for tiny UI blips.

const tickSoundBase64 = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="; // Minimal stub for a click
const swooshSoundBase64 = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="; // Minimal stub for a swoosh

export function playTickSound() {
  try {
    const audio = new Audio(tickSoundBase64);
    audio.volume = 0.2;
    audio.play().catch(() => {});
  } catch (e) {
    // Ignore errors (e.g. if user hasn't interacted with page yet)
  }
}

export function playSwooshSound() {
  try {
    const audio = new Audio(swooshSoundBase64);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch (e) {
    // Ignore errors
  }
}
