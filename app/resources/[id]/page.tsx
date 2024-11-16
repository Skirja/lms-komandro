"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

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
    // Add styles to body when component mounts
    document.body.style.margin = "0"
    document.body.style.padding = "0"
    document.body.style.minHeight = "100vh"
    document.documentElement.style.backgroundColor = "#f6f8fa"
    document.body.setAttribute('data-color-mode', 'light')
    
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

    // Cleanup styles when component unmounts
    return () => {
      document.body.style.margin = ""
      document.body.style.padding = ""
      document.body.style.minHeight = ""
      document.documentElement.style.backgroundColor = ""
      document.body.removeAttribute('data-color-mode')
    }
  }, [params.id, session])

  if (!resource) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Content</h2>
          <p>{error}</p>
        </div>
      </main>
    )
  }

  return (
    <MDEditor
      value={resource.content}
      hideToolbar={true}
      preview="preview"
      visibleDragbar={false}
      height="100vh"
      style={{
        margin: 0,
        padding: 0,
        border: 'none',
        backgroundColor: '#f6f8fa',
      }}
      previewOptions={{
        style: {
          padding: '2rem',
          backgroundColor: '#f6f8fa',
          minHeight: '100vh',
        }
      }}
    />
  )
}
