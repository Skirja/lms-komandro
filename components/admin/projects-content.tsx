import React, { useState, useEffect } from "react"
import { Plus, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AddProjectDialog } from "./add-project-dialog"
import { EditProjectDialog } from "./edit-project-dialog"

interface Project {
  id: string
  title: string
  track: string
  deadline: string
  description: string
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Failed to fetch projects")
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      toast.success("Project deleted successfully")
      fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project")
    }
  }

  const handleDownloadSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/download`)
      if (!response.ok) {
        throw new Error('Failed to download submission')
      }

      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'submission.zip'

      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading submission:', error)
      alert('Failed to download submission. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    })
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
        setIsAddDialogOpen(false)
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <div className="text-sm text-gray-500">Track: {project.track}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingProject(project)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Deadline: {formatDate(project.deadline)}
            </div>

            <p className="mt-2 text-gray-700">{project.description}</p>

            {project.submissions.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Submissions:</h4>
                {project.submissions.map((submission) => (
                  <div key={submission.id} className="bg-gray-50 p-3 rounded-md mb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{submission.user.name}</p>
                        <p className="text-xs text-gray-500">{submission.user.email}</p>
                        <p className="text-xs text-gray-500">Submitted: {formatDate(submission.createdAt)}</p>
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

      <AddProjectDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleCreateProject}
        isLoading={isLoading}
      />

      {editingProject && (
        <EditProjectDialog
          project={editingProject}
          isOpen={true}
          onClose={() => setEditingProject(null)}
          onSave={() => {
            setEditingProject(null)
            fetchProjects()
          }}
        />
      )}
    </div>
  )
}
