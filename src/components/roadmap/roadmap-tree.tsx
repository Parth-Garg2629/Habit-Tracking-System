"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { RoadmapNode, NodeStatus } from "@/types/roadmap";
import { RoadmapNodeCard } from "@/components/roadmap/roadmap-node-card";
import { NodeFormDialog } from "@/components/roadmap/node-form-dialog";
import { cn } from "@/lib/utils";

interface RoadmapTreeProps {
  tree: RoadmapNode[];
  viewMode: "tree" | "flowchart";
  onAddNode: (
    parentId: string | null,
    data: {
      title: string;
      description?: string;
      isSubtopic?: boolean;
    }
  ) => Promise<void>;
  onEditNode: (
    nodeId: string,
    data: {
      title?: string;
      description?: string;
      status?: NodeStatus;
      isSubtopic?: boolean;
    }
  ) => Promise<void>;
  onDeleteNode: (nodeId: string) => Promise<void>;
}

export function RoadmapTree({
  tree,
  viewMode,
  onAddNode,
  onEditNode,
  onDeleteNode,
}: RoadmapTreeProps) {
  const [addRootOpen, setAddRootOpen] = useState(false);

  if (tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-secondary/60 border border-border/50">
            <Plus className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              This roadmap is empty
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add your first topic to start building the tree
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 mt-2"
            onClick={() => setAddRootOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add First Topic
          </Button>
        </div>

        <NodeFormDialog
          open={addRootOpen}
          onOpenChange={setAddRootOpen}
          mode="create"
          onSubmit={async (data) => {
            await onAddNode(null, data);
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Add root node button */}
      <div className="mb-6 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
          onClick={() => setAddRootOpen(true)}
        >
          <Plus className="h-3 w-3" />
          Add Root Topic
        </Button>
      </div>

      {/* Tree container */}
      <div className={cn("pb-8", viewMode === "tree" ? "overflow-x-auto" : "flex justify-center")}>
        <div className={cn("flex min-w-fit", viewMode === "tree" ? "flex-col items-center" : "flex-col items-start")}>
          {/* Root-level horizontal bar for tree mode */}
          {viewMode === "tree" && tree.length > 1 && (
            <div
              className="h-px bg-border mb-0"
              style={{ width: `${(tree.length - 1) * 240}px` }}
            />
          )}

          {/* Root nodes row/col */}
          <div className={cn("flex", viewMode === "tree" ? "gap-4" : "flex-col gap-6")}>
            {tree.map((rootNode, index) => (
              <div key={rootNode.id} className="flex flex-col items-center">
                {viewMode === "tree" && tree.length > 1 && (
                  <div className="w-px h-6 bg-border" />
                )}
                {viewMode === "flowchart" && index > 0 && (
                  <div className="w-px h-6 bg-border mb-2" />
                )}
                <RoadmapNodeCard
                  node={rootNode}
                  viewMode={viewMode}
                  onAddChild={async (parentId, data) => {
                    await onAddNode(parentId, data);
                  }}
                  onAddSibling={async (data) => {
                    await onAddNode(null, data); // Root nodes have null parent
                  }}
                  onEdit={onEditNode}
                  onDelete={onDeleteNode}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <NodeFormDialog
        open={addRootOpen}
        onOpenChange={setAddRootOpen}
        mode="create"
        onSubmit={async (data) => {
          await onAddNode(null, data);
        }}
      />
    </div>
  );
}
