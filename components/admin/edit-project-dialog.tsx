import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Project {
  id: string
  title: string
  description: string
  track: string
  deadline: string
}

interface EditProjectDialogProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function EditProjectDialog({
  project,
  isOpen,
  onClose,
  onSave,
}: EditProjectDialogProps) {
  const [title, setTitle] = React.useState(project.title)
  const [description, setDescription] = React.useState(project.description)
  const [track] = React.useState(project.track)
  const [deadline, setDeadline] = React.useState(
    new Date(project.deadline).toISOString().split('T')[0]
  )
  const [isLoading, setIsLoading] = React.useState(false)

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          track,
          deadline: new Date(deadline).toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to update project')
      }

      toast.success('Project updated successfully')
      onSave()
      onClose()
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to the project details here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="track">Track</label>
              <Input
                id="track"
                value={track}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="deadline">Deadline</label>
              <Input
                id="deadline"
                type="date"
                value={formatDateForInput(deadline)}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
