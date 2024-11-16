"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Track } from "@/lib/constants"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import dynamic from "next/dynamic"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
)

export default function AddResourcePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditing = searchParams.get("edit") === "true"
  const resourceId = searchParams.get("id")

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    track: "",
    thumbnail: null as File | null,
    content: ""
  })

  useEffect(() => {
    if (isEditing && resourceId) {
      // Fetch existing resource data
      fetch(`/api/resources/${resourceId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            title: data.title,
            description: data.description,
            track: data.track,
            thumbnail: null,
            content: data.content
          })
        })
        .catch(() => {
          toast.error("Failed to fetch resource data")
          router.push("/admin")
        })
    }
  }, [isEditing, resourceId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formDataToSend = new FormData()
    formDataToSend.append("title", formData.title)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("track", formData.track)
    formDataToSend.append("content", formData.content)
    if (formData.thumbnail) {
      formDataToSend.append("thumbnail", formData.thumbnail)
    }

    try {
      const url = isEditing ? `/api/resources/${resourceId}` : "/api/resources"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      if (!response.ok) throw new Error()

      toast.success(isEditing ? "Resource updated successfully" : "Resource created successfully")
      router.push("/admin")
    } catch {
      toast.error(isEditing ? "Failed to update resource" : "Failed to create resource")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        thumbnail: e.target.files![0]
      }))
    }
  }

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Resource Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="track">Track</Label>
          <Select
            value={formData.track}
            onValueChange={(value) => setFormData(prev => ({ ...prev, track: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Track.WEB}>Web Development</SelectItem>
              <SelectItem value={Track.ANDROID}>Android Development</SelectItem>
              <SelectItem value={Track.UIUX}>UI/UX Design</SelectItem>
              <SelectItem value={Track.DEVOPS}>DevOps</SelectItem>
              <SelectItem value={Track.IOT}>IoT</SelectItem>
              <SelectItem value={Track.QA}>Quality Assurance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required={!isEditing}
          />
        </div>

        <div data-color-mode="light">
          <Label>Content</Label>
          <MDEditor
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value || "" }))}
            height={400}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  )
}
