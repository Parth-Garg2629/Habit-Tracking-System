"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapNode, NodeStatus } from "@/types/roadmap";
import { NodeFormDialog } from "@/components/roadmap/node-form-dialog";

const STATUS_CONFIG: Record<
  NodeStatus,
  { label: string; className: string }
> = {
  NOT_STARTED: {
    label: "Not Started",
    className: "bg-muted text-muted-foreground",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
};

interface RoadmapNodeCardProps {
  node: RoadmapNode;
  viewMode: "tree" | "flowchart";
  onAddChild: (
    parentId: string,
    data: {
      title: string;
      description?: string;
      isSubtopic?: boolean;
    }
  ) => Promise<void>;
  onAddSibling: (
    data: {
      title: string;
      description?: string;
      isSubtopic?: boolean;
    }
  ) => Promise<void>;
  onEdit: (
    nodeId: string,
    data: {
      title?: string;
      description?: string;
      status?: NodeStatus;
      isSubtopic?: boolean;
    }
  ) => Promise<void>;
  onDelete: (nodeId: string) => Promise<void>;
}

export function RoadmapNodeCard({
  node,
  viewMode,
  onAddChild,
  onAddSibling,
  onEdit,
  onDelete,
}: RoadmapNodeCardProps) {
  const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
  const [addSiblingDialogOpen, setAddSiblingDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const statusConfig = STATUS_CONFIG[node.status];
  const hasChildren = node.children.length > 0 || node.subtopics.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node card */}
      <div className="group relative w-56 rounded-lg border bg-card p-3 shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate" title={node.title}>
              {node.title}
            </h4>
            {node.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {node.description}
              </p>
            )}
          </div>
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 text-muted-foreground"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>

        {/* Status badge */}
        <div className="mt-2">
          <Badge
            className={cn(
              "text-[10px] px-1.5 py-0 border",
              statusConfig.className
            )}
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* Subtopics as chips */}
        {node.subtopics.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {node.subtopics.map((sub) => (
              <div
                key={sub.id}
                className="group/sub relative inline-flex items-center"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] px-1.5 py-0 font-normal",
                    sub.status === "COMPLETED" && "line-through opacity-60"
                  )}
                >
                  {sub.title}
                </Badge>
                <button
                  className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive text-destructive-foreground items-center justify-center text-[8px] leading-none hidden group-hover/sub:flex"
                  onClick={() => onDelete(sub.id)}
                  title={`Delete "${sub.title}"`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            onClick={() => setAddChildDialogOpen(true)}
            title="Add sub-topic (branch)"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            onClick={() => setAddSiblingDialogOpen(true)}
            title="Add next topic (sequence)"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            onClick={() => setEditDialogOpen(true)}
            title="Edit node"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(node.id)}
            title="Delete node"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Children (recursive rendering) */}
      {!collapsed && node.children.length > 0 && (
        <div className={cn("mt-0 flex items-center", viewMode === "tree" ? "flex-col" : "flex-col items-start")}>
          {/* Vertical connector from parent to horizontal bar */}
          {viewMode === "tree" && (
            <div className="w-px h-6 bg-border" />
          )}

          {/* Horizontal bar connecting children in tree mode */}
          {viewMode === "tree" && node.children.length > 1 && (
            <div
              className="h-px bg-border"
              style={{
                width: `${(node.children.length - 1) * 240}px`,
              }}
            />
          )}

          {/* Children row/col */}
          <div className={cn("flex", viewMode === "tree" ? "gap-4" : "flex-col gap-6 mt-6")}>
            {node.children.map((child, index) => (
              <div
                key={child.id}
                className="flex flex-col items-center"
              >
                {/* Vertical connector to child */}
                {viewMode === "tree" && (
                  <div className="w-px h-6 bg-border" />
                )}
                {viewMode === "flowchart" && (
                  <div className="w-px h-6 bg-border mb-2" />
                )}
                <RoadmapNodeCard
                  node={child}
                  viewMode={viewMode}
                  onAddChild={onAddChild}
                  onAddSibling={async (data) => {
                    await onAddChild(node.id, data); // For a child's sibling, the parent is the current node
                  }}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add child dialog */}
      <NodeFormDialog
        open={addChildDialogOpen}
        onOpenChange={setAddChildDialogOpen}
        mode="create"
        parentTitle={node.title}
        onSubmit={async (data) => {
          await onAddChild(node.id, data);
        }}
      />

      {/* Add sibling dialog */}
      <NodeFormDialog
        open={addSiblingDialogOpen}
        onOpenChange={setAddSiblingDialogOpen}
        mode="create"
        parentTitle="Next Topic"
        onSubmit={async (data) => {
          await onAddSibling(data);
        }}
      />

      {/* Edit dialog */}
      <NodeFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        mode="edit"
        node={node}
        onSubmit={async (data) => {
          await onEdit(node.id, data);
        }}
      />
    </div>
  );
}
