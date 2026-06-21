"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RoadmapNode, NodeStatus } from "@/types/roadmap";

const STATUS_OPTIONS: { value: NodeStatus; label: string }[] = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

interface NodeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  /** The node being edited (only for mode="edit") */
  node?: RoadmapNode;
  /** The parent node title (for display context in create mode) */
  parentTitle?: string;
  onSubmit: (data: {
    title: string;
    description?: string;
    isSubtopic?: boolean;
    status?: NodeStatus;
  }) => Promise<void>;
}

export function NodeFormDialog({
  open,
  onOpenChange,
  mode,
  node,
  parentTitle,
  onSubmit,
}: NodeFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubtopic, setIsSubtopic] = useState(false);
  const [status, setStatus] = useState<NodeStatus>("NOT_STARTED");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && node) {
      setTitle(node.title);
      setDescription(node.description || "");
      setIsSubtopic(node.isSubtopic);
      setStatus(node.status);
    } else {
      setTitle("");
      setDescription("");
      setIsSubtopic(false);
      setStatus("NOT_STARTED");
    }
  }, [mode, node, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        isSubtopic,
        ...(mode === "edit" ? { status } : {}),
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add Node" : "Edit Node"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create" && parentTitle
                ? `Adding under "${parentTitle}"`
                : mode === "create"
                ? "Add a root-level topic"
                : `Editing "${node?.title}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="node-title">Title</Label>
              <Input
                id="node-title"
                placeholder="e.g., React Fundamentals"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-description">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="node-description"
                placeholder="Brief notes about this topic..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="node-subtopic"
                checked={isSubtopic}
                onCheckedChange={(checked) =>
                  setIsSubtopic(checked === true)
                }
              />
              <Label
                htmlFor="node-subtopic"
                className="text-sm font-normal cursor-pointer"
              >
                Mark as subtopic{" "}
                <span className="text-muted-foreground">
                  (renders as a smaller chip instead of a full branch)
                </span>
              </Label>
            </div>
            {mode === "edit" && (
              <div className="grid gap-2">
                <Label htmlFor="node-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val as NodeStatus)}
                >
                  <SelectTrigger id="node-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || submitting}>
              {submitting
                ? mode === "create"
                  ? "Adding..."
                  : "Saving..."
                : mode === "create"
                ? "Add Node"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
