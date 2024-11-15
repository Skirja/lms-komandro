import React, { useState, useEffect } from "react"
import { Plus, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AddProjectDialog } from "./add-project-dialog"

interface Project {
  id: string
  title: string
  description: string
  track: string
  deadline: string
  submissions: Submission[]
}

interface Submission {
  id: string
  fileUrl: string
  userId: string
  user: {
    name: string
    email: string
  }
  createdAt: string
}

interface ProjectFormData {
  title: string
  description: string
  track: string
  deadline: string
}

export function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      if (response.ok) {
        setProjects(data)
      } else {
        toast.error("Failed to fetch projects")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Error fetching projects")
    }
  }

  const handleCreateProject = async (formData: ProjectFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          track: formData.track,
          deadline: new Date(formData.deadline).toISOString(),
        }),
      })

      if (response.ok) {
        toast.success("Project created successfully")
        setIsAddProjectOpen(false)
        fetchProjects()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to create project")
      }
    } catch (err) {
      console.error("Error creating project:", err)
      toast.error("Error creating project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      if (!confirm("Are you sure you want to delete this project?")) return

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Project deleted successfully")
        fetchProjects()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to delete project")
      }
    } catch (err) {
      console.error("Error deleting project:", err)
      toast.error("Error deleting project")
    }
  }

  const handleDownloadSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/download`)
      if (!response.ok) {
        throw new Error('Failed to download submission')
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'submission.zip'

      // Convert response to blob
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading submission:', error)
      alert('Failed to download submission. Please try again.')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects Management</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsAddProjectOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      <AddProjectDialog
        isOpen={isAddProjectOpen}
        onOpenChange={setIsAddProjectOpen}
        onSubmit={handleCreateProject}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.track}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm">{project.description}</p>

            <div className="text-sm text-gray-500">
              Deadline: {formatDate(project.deadline)}
            </div>

            {project.submissions.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Submissions:</h4>
                {project.submissions.map((submission) => (
                  <div key={submission.id} className="bg-gray-50 p-3 rounded-md mb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{submission.user.name}</p>
                        <p className="text-xs text-gray-500">{submission.user.email}</p>
                      </div>
                      <Button
                        onClick={() => handleDownloadSubmission(submission.id)}
                        size="sm"
                        variant="outline"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-4">No submissions yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
