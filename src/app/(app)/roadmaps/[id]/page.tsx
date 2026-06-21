"use client";

import { useParams, useRouter } from "next/navigation";
import { useRoadmapDetail } from "@/hooks/use-roadmap-detail";
import { RoadmapTree } from "@/components/roadmap/roadmap-tree";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RoadmapDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    roadmap,
    loading,
    error,
    updateRoadmap,
    addNode,
    updateNode,
    deleteNode,
  } = useRoadmapDetail(params.id);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "flowchart">("tree");

  const handleTitleEdit = () => {
    if (roadmap) {
      setTitleDraft(roadmap.title);
      setEditingTitle(true);
    }
  };

  const handleTitleSave = async () => {
    if (titleDraft.trim() && titleDraft.trim() !== roadmap?.title) {
      await updateRoadmap({ title: titleDraft.trim() });
    }
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setEditingTitle(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="space-y-4">
        <Link href="/roadmaps">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmaps
          </Button>
        </Link>
        <div className="text-center py-20 bg-secondary/20 rounded-xl border border-border/50">
          <p className="text-muted-foreground text-sm">
            {error || "Roadmap not found"}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => router.push("/roadmaps")}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/roadmaps">
          <Button variant="ghost" size="sm" className="gap-2 mb-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmaps
          </Button>
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              {editingTitle ? (
                <Input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleTitleKeyDown}
                  autoFocus
                  className="text-3xl font-semibold h-auto py-0 px-1 border-primary/50"
                />
              ) : (
                <h1
                  className="text-3xl font-semibold tracking-normal cursor-pointer hover:text-primary transition-colors group flex items-center gap-2"
                  onClick={handleTitleEdit}
                >
                  {roadmap.title}
                  <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                </h1>
              )}
            </div>
            {roadmap.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {roadmap.description}
              </p>
            )}
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border bg-card p-1 shadow-sm">
            <button
              onClick={() => setViewMode("tree")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === "tree"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              Tree View
            </button>
            <button
              onClick={() => setViewMode("flowchart")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === "flowchart"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              Flowchart
            </button>
          </div>
        </div>
      </div>

      {/* Tree visualization */}
      <RoadmapTree
        tree={roadmap.tree}
        viewMode={viewMode}
        onAddNode={async (parentId, data) => {
          await addNode({
            parentId,
            title: data.title,
            description: data.description,
            isSubtopic: data.isSubtopic,
          });
        }}
        onEditNode={async (nodeId, data) => {
          await updateNode(nodeId, data);
        }}
        onDeleteNode={async (nodeId) => {
          await deleteNode(nodeId);
        }}
      />
    </div>
  );
}
