"use client"

import React, { useState } from "react"
import { Book, ChevronUp, Home, Layout, LogOut, Menu, User, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = useState("beranda")

  // Dummy data untuk berbagai konten
  const exercises = [
    { name: "Pengantar Pemrograman", score: 85 },
    { name: "Struktur Data", score: 92 },
    { name: "Algoritma Dasar", score: 78 },
    { name: "Pemrograman Web", score: 88 },
  ]

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

  const projects = [
    {
      title: "Project Website Portfolio",
      deadline: "2024-04-01",
      status: "Dalam Pengerjaan"
    },
    {
      title: "Project E-Commerce",
      deadline: "2024-04-15",
      status: "Belum Dimulai"
    }
  ]

  // Komponen untuk setiap konten menu
  const BerandaContent = () => (
    <>
      <div
        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
        role="alert"
      >
        <p className="font-bold">Pemberitahuan</p>
        <p>Ada tugas baru yang perlu diselesaikan. Silakan cek halaman Latihan.</p>
      </div>

      <h1 className="text-2xl font-bold mb-6">Selamat datang kembali, John!</h1>

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
            {exercises.map((exercise, index) => (
              <TableRow key={index}>
                <TableCell>{exercise.name}</TableCell>
                <TableCell className="text-right">{exercise.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  )

  const SumberBelajarContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-6">Sumber Belajar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningMaterials.map((material, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image
                src={material.image}
                alt={material.title}
                width={300}
                height={200}
                className="rounded-t-lg"
              />
              <CardTitle>{material.title}</CardTitle>
              <CardDescription>{material.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{material.progress}%</span>
                </div>
                <Progress value={material.progress} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                {material.progress === 0 ? 'Mulai Belajar' : 'Lanjutkan'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )

  const LatihanContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-6">Latihan</h1>
      <div className="grid gap-6">
        {assignments.map((assignment, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
              <CardDescription>Tenggat: {assignment.dueDate}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm ${
                assignment.status === "Selesai" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {assignment.status}
              </span>
              <Button variant="outline">Lihat Detail</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )

  const ProjekContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-6">Pengumpulan Projek</h1>
      <div className="grid gap-6">
        {projects.map((project, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>Deadline: {project.deadline}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm ${
                project.status === "Selesai" 
                  ? "bg-green-100 text-green-800" 
                  : project.status === "Dalam Pengerjaan"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {project.status}
              </span>
              <Button>Upload Projek</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
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
          {[
            { id: "beranda", icon: Home, label: "Beranda" },
            { id: "sumber-belajar", icon: Book, label: "Sumber Belajar" },
            { id: "latihan", icon: Layout, label: "Latihan" },
            { id: "projek", icon: User, label: "Pengumpulan Projek" }
          ].map(({ id, icon: Icon, label }) => (
            <li key={id}>
              <button
                onClick={() => setActiveMenu(id)}
                className={`flex items-center space-x-2 w-full py-2 px-3 rounded-lg transition-colors ${
                  activeMenu === id 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
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
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-grow text-left">
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-500">student@example.com</p>
              </div>
              <ChevronUp className="h-5 w-5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
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
          src="/placeholder.svg"
          alt="LMS Logo"
          width={96}
          height={32}
          className="h-8"
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