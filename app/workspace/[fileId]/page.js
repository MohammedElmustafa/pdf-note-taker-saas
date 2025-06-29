"use client";

import React from "react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import WorkspaceHeader from "../_components/WorkspaceHeader";
import TextEditor from "../_components/TextEditior";
import PdfViewer from "../_components/PdfViewer";

export default function Workspace() {
  const { fileId } = useParams();

  // Load file metadata (name, URL, etc.)
  const fileInfo = useQuery(api.fileStorage.GetFileRecord, { fileId });

  return (
    <div className="p-4 space-y-6">
      <WorkspaceHeader fileName={fileInfo?.fileName} />

      <div className="grid grid-cols-2 gap-5">
        <div>
          {/* Text editor with notes */}
          <TextEditor fileId={fileId} />
        </div>

        <div>
          {/* PDF / document viewer */}
          <PdfViewer fileUrl={fileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
}
