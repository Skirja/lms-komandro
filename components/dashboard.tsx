"use client"

import React from "react"
import { Book, ChevronUp, Home, Layout, LogOut, Menu, User } from "lucide-react"
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
import Image from "next/image"
import Link from "next/link"

export default function DashboardPage() {
  // Dummy data for the exercises
  const exercises = [
    { name: "Pengantar Pemrograman", score: 85 },
    { name: "Struktur Data", score: 92 },
    { name: "Algoritma Dasar", score: 78 },
    { name: "Pemrograman Web", score: 88 },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Image
          src="/placeholder.svg"
          alt="LMS Logo"
          width={120}
          height={40}
          className="h-10"
        />
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          {[
            { href: "/dashboard", icon: Home, label: "Beranda" },
            { href: "/sumber-belajar", icon: Book, label: "Sumber Belajar" },
            { href: "/latihan", icon: Layout, label: "Latihan" },
            { href: "/projek", icon: User, label: "Pengumpulan Projek" }
          ].map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 py-2"
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage
                  src="/placeholder.svg"
                  alt="User"
                  width={32}
                  height={32}
                />
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
        {/* Notification Board */}
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">Pemberitahuan</p>
          <p>Ada tugas baru yang perlu diselesaikan. Silakan cek halaman Latihan.</p>
        </div>

        <h1 className="text-2xl font-bold mb-6">Selamat datang kembali, John!</h1>

        {/* Progress Section */}
        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Progres Belajar</h2>
          <div className="mb-2 flex justify-between items-center">
            <span>Penyelesaian Materi</span>
            <span className="font-semibold">75%</span>
          </div>
          <Progress value={75} className="w-full" />
        </section>

        {/* Exercise Table */}
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
      </main>
    </div>
  )
}