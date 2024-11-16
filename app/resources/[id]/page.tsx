"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"
import Image from "next/image"
import dynamic from "next/dynamic"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
)

interface Resource {
  id: string
  title: string
  description: string
  track: string
  content: string
  thumbnail: string
}

export default function ResourcePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [resource, setResource] = useState<Resource | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`/api/resources/${params.id}`)
        if (!response.ok) {
          throw new Error("Resource not found")
        }
        const data = await response.json()

        // Check if user has access to this resource
        if (data.track !== session?.user?.track) {
          throw new Error("Unauthorized")
        }

        setResource(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching resource:", error)
        setError(error instanceof Error ? error.message : "Error fetching resource")
        notFound()
      }
    }

    if (session?.user) {
      fetchResource()
    }
  }, [params.id, session])

  if (!resource) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="relative w-full h-[300px] mb-4">
            <Image
              src={resource.thumbnail}
              alt={resource.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          <CardTitle className="text-3xl">{resource.title}</CardTitle>
          <p className="text-gray-500 mt-2">{resource.description}</p>
          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
              {resource.track}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-600">
              <h2>Error Loading Content</h2>
              <p>{error}</p>
            </div>
          ) : (
            <div data-color-mode="light">
              <div className="wmde-markdown-var">
                <MDEditor
                  value={resource.content}
                  hideToolbar={true}
                  preview="preview"
                  height={500}
                  visibleDragbar={false}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
