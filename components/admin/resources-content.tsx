"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, Pencil, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface LearningResource {
  id: string
  title: string
  description: string
  track: string
  thumbnail: string
  content: string
}

export function ResourcesContent() {
  const [resources, setResources] = useState<LearningResource[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources")
      if (!response.ok) throw new Error()
      const data = await response.json()
      setResources(data)
    } catch {
      toast.error("Failed to fetch resources")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return

    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error()

      toast.success("Resource deleted successfully")
      fetchResources()
    } catch {
      toast.error("Failed to delete resource")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Resources</h2>
        <Button onClick={() => router.push("/admin/add-resource")}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <CardHeader className="relative h-48">
              <Image
                src={resource.thumbnail}
                alt={resource.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="text-xl mb-2">{resource.title}</CardTitle>
              <CardDescription className="mb-4">{resource.description}</CardDescription>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{resource.track}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/add-resource?edit=true&id=${resource.id}`)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(resource.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
