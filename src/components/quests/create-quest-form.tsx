"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateQuestPayload } from "@/types/quests";

interface CreateQuestFormProps {
  onCreate: (payload: CreateQuestPayload) => Promise<void>;
  onCancel: () => void;
}

export function CreateQuestForm({ onCreate, onCancel }: CreateQuestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xpReward, setXpReward] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    await onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      xpReward,
      isDaily: true,
    });
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in-0 slide-in-from-top-2 space-y-3 rounded-md border border-primary/20 bg-primary/5 p-4 duration-200"
    >
      <Input
        placeholder="Quest title, e.g. Solve 2 coding problems"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="border-border/60 bg-background/60 text-sm"
        autoFocus
        required
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={2}
        className="resize-none border-border/60 bg-background/60 text-sm"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <label className="text-xs text-muted-foreground" htmlFor="quest-xp">
            XP reward
          </label>
          <input
            id="quest-xp"
            type="number"
            min={1}
            max={100}
            value={xpReward}
            onChange={(event) =>
              setXpReward(Math.min(100, Math.max(1, parseInt(event.target.value, 10) || 1)))
            }
            className="w-16 rounded-md border border-border/60 bg-background/60 px-2 py-1 text-center text-xs text-foreground outline-none transition focus:border-primary/50"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || submitting}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3 w-3" />
            {submitting ? "Creating..." : "Create quest"}
          </button>
        </div>
      </div>
    </form>
  );
}
