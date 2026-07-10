"use client";

import { useState, useEffect } from "react";
import { usePlayer } from "@/hooks/use-player";
import { Loader2, Save, ShieldAlert, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { player, loading, refetch } = usePlayer();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize form state once player data is loaded
  useEffect(() => {
    if (player?.name) {
      setName(player.name);
    }
  }, [player]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/player/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await refetch();
      setMessage("[ SUCCESS ]: OPERATOR PROFILE SYNCHRONIZED.");
    } catch (err) {
      setMessage(err instanceof Error ? `[ ERROR ]: ${err.message}` : "[ ERROR ]: SYSTEM WRITE FAILURE");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-gutter max-w-3xl">
      {/* Settings Header */}
      <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-primary/20 pb-4">
        <div>
          <div className="flex items-center gap-2 font-data-mono text-xs text-primary mb-1">
            <Sliders className="h-3.5 w-3.5" />
            <span>OPERATOR CONFIGURATION</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] glitch-text">
            SYSTEM_SETTINGS
          </h1>
          <p className="font-data-mono text-xs text-outline mt-1">
            MANAGE OPERATOR IDENTITY, TELEMETRY PREFERENCES &amp; SECURITY PARAMETERS
          </p>
        </div>
        <div className="font-label-caps text-xs px-3 py-1 rounded bg-primary/10 border border-primary/30 text-primary">
          [ ACCESS: LEVEL 4 AUDIT ]
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24 glass-panel rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6 pt-2">
          {/* Profile Card */}
          <div className="glass-panel p-6 rounded-lg space-y-6 relative overflow-hidden border-l-4 border-l-primary">
            <div className="border-b border-primary/20 pb-4">
              <h3 className="font-headline-sm text-headline-sm text-primary">OPERATOR IDENTITY MATRIX</h3>
              <p className="font-data-mono text-xs text-outline mt-1">
                Configure your display designation and neural identifier.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-data-mono text-xs text-outline block">OPERATOR DISPLAY NAME</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Operator Designation"
                  disabled={saving}
                  className="w-full rounded bg-background/60 border border-primary/40 px-4 py-2.5 font-data-mono text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner disabled:opacity-50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="font-data-mono text-xs text-outline block">REGISTERED TELEMETRY EMAIL</label>
                <input
                  value={player?.email || "OPERATOR@AETHER.OS"}
                  disabled
                  className="w-full rounded bg-surface-variant/30 border border-outline/20 px-4 py-2.5 font-data-mono text-sm text-outline cursor-not-allowed"
                />
                <div className="flex items-center gap-1.5 font-data-mono text-[10px] text-outline-variant pt-1">
                  <ShieldAlert className="h-3 w-3 text-secondary" />
                  <span>SECURE CREDENTIAL: Email is bound to encrypted authentication provider and cannot be altered.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={saving || name === player?.name}
                  className={cn(
                    "flex items-center justify-center gap-2.5 rounded px-6 py-2.5 font-data-mono text-xs font-bold tracking-wider transition-all duration-300",
                    !saving && name !== player?.name
                      ? "bg-primary text-background hover:bg-primary-fixed shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:scale-105"
                      : "bg-surface-variant/50 text-outline cursor-not-allowed border border-outline/20"
                  )}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      SYNCHRONIZING PROFILE...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      COMMIT PROFILE CHANGES
                    </>
                  )}
                </button>

                {message && (
                  <span
                    className={cn(
                      "font-data-mono text-xs font-bold",
                      message.includes("ERROR") ? "text-error" : "text-success neon-text"
                    )}
                  >
                    {message}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
