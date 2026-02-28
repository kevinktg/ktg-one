"use client";

import { useState } from "react";

export function HubGate({ children, isAuthed }) {
  const [authed, setAuthed] = useState(isAuthed);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/hub-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthed(true);
    } else {
      setError("access denied");
    }
    setLoading(false);
  }

  if (authed) return children;

  return (
    <div className="relative min-h-screen">
      {/* Tools visible underneath at 20% opacity */}
      <div className="opacity-20 pointer-events-none blur-[2px] select-none">
        {children}
      </div>

      {/* Login overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-6 p-8 border border-[#00f0ff]/20 bg-black/80 backdrop-blur-sm rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.15)]"
        >
          <div className="w-3 h-3 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
          <h2 className="font-syne text-xl font-bold text-white lowercase">
            laboratory access
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter passkey"
            className="w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00f0ff]/50 transition-colors font-mono"
            autoFocus
          />
          {error && (
            <span className="text-red-400 text-xs font-mono">{error}</span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-64 py-3 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] rounded-xl text-sm font-mono lowercase hover:bg-[#00f0ff]/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50"
          >
            {loading ? "..." : "authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}
