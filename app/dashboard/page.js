"use client"

import React, { useState } from "react"
import { Toaster, toast } from "../../components/ui/sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import UploadPdfDialog from "./_components/UploadPdfDialog"
import { api } from "../../convex/_generated/api"
import { useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { FileText } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const{ user } = useUser();
  const pdfs = useQuery(api.fileStorage.GetUserFiles, { userEmail: user?.primaryEmailAddress?.emailAddress }) || []

  const [isDialogOpen, setDialogOpen] = useState(false)
  function handleUploadSuccess(newPdf) {
    toast.success("PDF uploaded successfully")
    setDialogOpen(false)
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {!Array.isArray(pdfs) || pdfs.length === 0 ? (
          <p className="text-center col-span-full">No PDFs to display</p>
        ) : (
          pdfs.map((pdf) => (
            <Card key={pdf._id} className="flex items-center space-x-4 p-4">
              <FileText className="w-8 h-8 text-black-600" />
              <div>
                <CardHeader className="p-0">
                  <Link href={'/workspace/'+pdf.fileId}>
                    <CardTitle className="text-lg">{pdf.fileName}</CardTitle>
                  </Link>
                  <CardDescription className="text-sm text-gray-500">
                    Uploaded date not available
                  </CardDescription>
                </CardHeader>
              </div>
            </Card>
          ))
        )}
      </div>
      <UploadPdfDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  )
}
