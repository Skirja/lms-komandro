"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Book, ChevronUp, Home, Layout, LogOut, Menu, User, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { handleLogout } from "@/lib/utils/auth"
import { useSession } from "next-auth/react"

interface Project {
  id: string;
  title: string;
  track: string;
  deadline: string;
  description: string;
  submissions: Submission[];
}

interface Submission {
  userId: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  track: string;
  content: string;
  thumbnail: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeMenu, setActiveMenu] = useState("beranda")
  const [user, setUser] = useState<{
    name: string;
    email: string;
    track?: string;
  } | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }, [])

  const fetchResources = useCallback(async () => {
    try {
      const response = await fetch('/api/resources')
      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }
      const data = await response.json()
      // Filter resources based on user's track
      const filteredResources = data.filter((resource: Resource) => 
        resource.track === session?.user?.track
      )
      setResources(filteredResources)
    } catch (error) {
      console.error('Error fetching resources:', error)
    }
  }, [session])

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || '',
        email: session.user.email || '',
        track: session.user.track,
      })
      fetchProjects()
      fetchResources()
    }
  }, [session, fetchProjects, fetchResources])

  const handleSubmitProject = async (projectId: string, file: File) => {
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/projects/${projectId}/submissions`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit project')
      }

      await fetchProjects()
    } catch (error: unknown) {
      console.error('Error submitting project:', error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Failed to submit project. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
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

  const learningMaterials = [
    {
      title: "Dasar Web",
      description: "Pelajari dasar-dasar pengembangan web modern",
      progress: 0,
      image: "/placeholder.svg"
    },
    {
      title: "HTML & CSS",
      description: "Fundamental HTML5 dan CSS3 untuk web development",
      progress: 30,
      image: "/placeholder.svg"
    }
  ]

  const assignments = [
    {
      title: "Quiz Minggu 1",
      dueDate: "2024-03-25",
      status: "Belum Selesai"
    },
    {
      title: "Quiz Minggu 2",
      dueDate: "2024-03-28",
      status: "Selesai"
    }
  ]

  const BerandaContent = () => (
    <div>
      <div
        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
        role="alert"
      >
        <p className="font-bold">Pemberitahuan</p>
        <p>Ada tugas baru yang perlu diselesaikan. Silakan cek halaman Latihan.</p>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        Selamat datang kembali, {user?.name?.split(' ')[0] || 'User'}!
      </h1>

      <section className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Progres Belajar</h2>
        <div className="mb-2 flex justify-between items-center">
          <span>Penyelesaian Materi</span>
          <span className="font-semibold">75%</span>
        </div>
        <Progress value={75} className="w-full" />
      </section>

      <section className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Nilai Latihan</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Materi</TableHead>
              <TableHead className="text-right">Nilai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {learningMaterials.map((material, index) => (
              <TableRow key={index}>
                <TableCell>{material.title}</TableCell>
                <TableCell className="text-right">{material.progress}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )

  const SumberBelajarContent = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sumber Belajar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image
                src={resource.thumbnail}
                alt={resource.title}
                width={300}
                height={200}
                className="rounded-t-lg"
              />
              <CardTitle>{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Track</span>
                  <span>{resource.track}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href={`/resources/${resource.id}`}>
                  Lihat Materi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )

  const LatihanContent = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6">Latihan</h1>
      <div className="grid gap-6">
        {assignments.map((assignment, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
              <CardDescription>Tenggat: {formatDate(assignment.dueDate)}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm ${assignment.status === "Selesai"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
                }`}>
                {assignment.status}
              </span>
              <Button variant="secondary">Lihat Detail</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )

  const ProjekContent = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pengumpulan Projek</h2>
      <div className="grid gap-4">
        {projects.map((project) => {
          const hasSubmitted = project.submissions.some(
            (submission) => submission.userId === session?.user?.id
          )

          return (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">Track: {project.track}</span>
                  <span>Deadline: {formatDate(project.deadline)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                {hasSubmitted ? (
                  <div className="bg-green-50 text-green-600 p-3 rounded-md">
                    Projek sudah dikumpulkan
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept=".zip,.rar"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleSubmitProject(project.id, file)
                        }
                      }}
                      disabled={isSubmitting}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Format file yang diterima: .zip, .rar
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
        {projects.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Belum ada projek yang tersedia untuk track Anda
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )

  const getContent = () => {
    switch (activeMenu) {
      case "beranda":
        return <BerandaContent />
      case "sumber-belajar":
        return <SumberBelajarContent />
      case "latihan":
        return <LatihanContent />
      case "projek":
        return <ProjekContent />
      default:
        return <BerandaContent />
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-2">
        <Image
          src="/images/Logo.png"
          alt="LMS Logo"
          width={40}
          height={40}
          className="h-10"
        />
        <span className="font-bold text-lg">LMS Komandro</span>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          {[/* eslint-disable @typescript-eslint/no-use-before-define */
            { id: "beranda", icon: Home, label: "Beranda" },
            { id: "sumber-belajar", icon: Book, label: "Sumber Belajar" },
            { id: "latihan", icon: Layout, label: "Latihan" },
            { id: "projek", icon: User, label: "Pengumpulan Projek" }
          ].map(({ id, icon: Icon, label }) => (
            <li key={id}>
              <button
                onClick={() => setActiveMenu(id)}
                className={`flex items-center space-x-2 w-full py-2 px-3 rounded-lg transition-colors ${activeMenu === id
                  ? "bg-green-50 text-green-600"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}>
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <div className="flex-grow text-left">
                <p className="font-semibold">{user?.name || 'Loading...'}</p>
                <p className="text-sm text-gray-500">{user?.email || 'Loading...'}</p>
              </div>
              <ChevronUp className="h-5 w-5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      {/* Mobile Header */}
      <header className="bg-white p-4 flex justify-between items-center md:hidden">
        <Image
          src="/images/Logo.png"
          alt="LMS Logo"
          width={40}
          height={40}
          className="h-10"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[385px] p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white shadow-md flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {getContent()}
      </main>
    </div>
  )
}