"use client"

import React, { useState } from "react"
import {
  Users, ChevronUp, Home, Layout, LogOut, Menu, BookOpen,
  Upload, Plus, Download, Pencil, Trash2
} from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { handleLogout } from "@/lib/utils/auth"

// Add this interface near the top of the file, before the component
interface User {
  id: string;
  name: string;
  email: string;
  track: string;
  role: 'ADMIN' | 'STUDENT';
}

// Tambahkan interface untuk submission
interface Submission {
  id: number;
  studentName: string;
  projectTitle: string;
  track: string;
  submissionDate: string;
  fileUrl: string;
  isDone?: boolean; // Tambah properti isDone
}

export default function AdminDashboardPage() {
  const [activeMenu, setActiveMenu] = useState("beranda")

  // Dummy data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", track: "Web" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", track: "Android" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", track: "UI/UX" },
  ]

  const learningMaterials = [
    {
      id: 1,
      title: "Dasar Web",
      track: "Web",
      description: "Pelajari dasar-dasar pengembangan web modern",
    },
    {
      id: 2,
      title: "Android Fundamental",
      track: "Android",
      description: "Fundamental pengembangan aplikasi Android",
    },
  ]

  const assignments = [
    {
      id: 1,
      title: "Quiz Web Fundamental",
      track: "Web",
      dueDate: "2024-03-25",
    },
    {
      id: 2,
      title: "UI Design Challenge",
      track: "UI/UX",
      dueDate: "2024-03-28",
    },
  ]

  const submissions: Submission[] = [
    {
      id: 1,
      studentName: "John Doe",
      projectTitle: "Portfolio Website",
      track: "Web",
      submissionDate: "2024-03-20",
      fileUrl: "/files/project1.zip",
      isDone: false
    },
    {
      id: 2,
      studentName: "Jane Smith",
      projectTitle: "E-Commerce App",
      track: "Android",
      submissionDate: "2024-03-22",
      fileUrl: "/files/project2.zip",
      isDone: false
    },
  ]

  // Komponen untuk setiap konten menu
  const BerandaContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materi</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Aktif</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submission</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Track</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.track}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Project</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.slice(0, 5).map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.studentName}</TableCell>
                    <TableCell>{submission.projectTitle}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )

  const ManageUsersContent = () => {
    const [users, setUsers] = React.useState<User[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
    const [selectedTrack, setSelectedTrack] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState<string>("")

    // Fetch users
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/users')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setUsers(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch users')
      } finally {
        setIsLoading(false)
      }
    }

    // Add user
    const handleAddUser = async (formData: FormData) => {
      try {
        const userData = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          password: formData.get('password') as string,
          track: formData.get('track') as string,
          role: 'STUDENT'
        }

        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        fetchUsers()
        setIsAddDialogOpen(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to add user')
      }
    }

    // Update user
    const handleUpdateUser = async (formData: FormData) => {
      try {
        const userData = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          track: formData.get('track') as string
        }

        const res = await fetch(`/api/users/${selectedUser?.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        fetchUsers()
        setIsEditDialogOpen(false)
        setSelectedUser(null)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update user')
      }
    }

    // Delete user
    const handleDeleteUser = async (id: string) => {
      if (!confirm('Are you sure you want to delete this user?')) return

      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE'
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        fetchUsers()
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to delete user')
      }
    }

    React.useEffect(() => {
      fetchUsers()
    }, [])

    // Filter users
    const filteredUsers = users.filter(user => {
      const trackMatch = selectedTrack === "all" || 
        user.track.toLowerCase() === selectedTrack.toLowerCase()
      
      const searchMatch = (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      return trackMatch && searchMatch
    })

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen User</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah User Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi user yang akan ditambahkan
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleAddUser(new FormData(e.currentTarget))
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="track">Penjurusan</Label>
                    <Select name="track" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih penjurusan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEB">Web</SelectItem>
                        <SelectItem value="ANDROID">Android</SelectItem>
                        <SelectItem value="UI_UX">UI/UX</SelectItem>
                        <SelectItem value="DEVOPS">DevOps</SelectItem>
                        <SelectItem value="IOT">IoT</SelectItem>
                        <SelectItem value="QUALITY_ASSURANCE">Quality Assurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="mb-4 flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search-user">Cari User</Label>
            <Input
              id="search-user"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="track-filter">Filter Track</Label>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Track</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="ui_ux">UI/UX</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="iot">IoT</SelectItem>
                <SelectItem value="quality_assurance">Quality Assurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Tidak ada data user
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.track}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update informasi user
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleUpdateUser(new FormData(e.currentTarget))
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nama Lengkap</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={selectedUser?.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={selectedUser?.email}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-track">Penjurusan</Label>
                  <Select name="track" defaultValue={selectedUser?.track} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penjurusan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEB">Web</SelectItem>
                      <SelectItem value="ANDROID">Android</SelectItem>
                      <SelectItem value="UI_UX">UI/UX</SelectItem>
                      <SelectItem value="DEVOPS">DevOps</SelectItem>
                      <SelectItem value="IOT">IoT</SelectItem>
                      <SelectItem value="QUALITY_ASSURANCE">Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  const ManageMaterialsContent = () => {
    const [selectedTrack, setSelectedTrack] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState<string>("")

    const filteredMaterials = learningMaterials.filter(material => {
      const trackMatch = selectedTrack === "all" || 
        material.track.toLowerCase() === selectedTrack.toLowerCase()
      
      const searchMatch = (
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      return trackMatch && searchMatch
    })

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Materi</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Materi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Materi Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi materi pembelajaran
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Judul Materi</Label>
                  <Input id="title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="track">Track</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="android">Android</SelectItem>
                      <SelectItem value="uiux">UI/UX</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="iot">IoT</SelectItem>
                      <SelectItem value="qa">Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input id="description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Konten</Label>
                  <Input id="content" type="file" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4 flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search-material">Cari Materi</Label>
            <Input
              id="search-material"
              placeholder="Cari judul materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="track-filter">Filter Track</Label>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Track</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="ui_ux">UI/UX</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="iot">IoT</SelectItem>
                <SelectItem value="quality_assurance">Quality Assurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.title}</TableCell>
                    <TableCell>{material.track}</TableCell>
                    <TableCell>{material.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    )
  }

  const ManageAssignmentsContent = () => {
    const [selectedTrack, setSelectedTrack] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState<string>("")

    const filteredAssignments = assignments.filter(assignment => {
      const trackMatch = selectedTrack === "all" || 
        assignment.track.toLowerCase() === selectedTrack.toLowerCase()
      
      const searchMatch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
      
      return trackMatch && searchMatch
    })

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Latihan</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Latihan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Latihan Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi latihan atau quiz
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Judul Latihan</Label>
                  <Input id="title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="track">Track</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="android">Android</SelectItem>
                      <SelectItem value="uiux">UI/UX</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="iot">IoT</SelectItem>
                      <SelectItem value="qa">Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Tenggat Waktu</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4 flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search-assignment">Cari Latihan</Label>
            <Input
              id="search-assignment"
              placeholder="Cari judul latihan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="track-filter">Filter Track</Label>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Track</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="ui_ux">UI/UX</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="iot">IoT</SelectItem>
                <SelectItem value="quality_assurance">Quality Assurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Tenggat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.track}</TableCell>
                    <TableCell>{assignment.dueDate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    )
  }

  const ManageSubmissionsContent = () => {
    const [selectedTrack, setSelectedTrack] = useState<string>("all")
    const [submissionStatus, setSubmissionStatus] = useState<{ [key: number]: boolean }>({})
    const [searchQuery, setSearchQuery] = useState<string>("")

    const toggleSubmissionStatus = (submissionId: number) => {
      setSubmissionStatus(prev => ({
        ...prev,
        [submissionId]: !prev[submissionId]
      }))
    }

    const filteredSubmissions = submissions
      .filter(submission => {
        const trackMatch = selectedTrack === "all" || 
          submission.track.toLowerCase() === selectedTrack.toLowerCase()
        
        const searchMatch = submission.studentName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
        
        return trackMatch && searchMatch
      })

    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Pengumpulan Projek</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Projek
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Projek Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi projek yang akan ditambahkan
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Judul Projek</Label>
                  <Input id="title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="track">Track</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="android">Android</SelectItem>
                      <SelectItem value="uiux">UI/UX</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="iot">IoT</SelectItem>
                      <SelectItem value="qa">Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Tenggat Waktu</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input id="description" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4 flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search">Cari Nama</Label>
            <Input
              id="search"
              placeholder="Cari nama siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div>
            <Label htmlFor="track-filter">Filter Track</Label>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Track</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="ui_ux">UI/UX</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="iot">IoT</SelectItem>
                <SelectItem value="quality_assurance">Quality Assurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Judul Project</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Tanggal Submit</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.studentName}</TableCell>
                    <TableCell>{submission.projectTitle}</TableCell>
                    <TableCell>{submission.track}</TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={submissionStatus[submission.id] ? "destructive" : "default"}
                        onClick={() => toggleSubmissionStatus(submission.id)}
                      >
                        {submissionStatus[submission.id] ? "Mark as Undone" : "Mark as Done"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Tidak ada data submission untuk track ini
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </>
    )
  }

  const getContent = () => {
    switch (activeMenu) {
      case "beranda":
        return <BerandaContent />
      case "users":
        return <ManageUsersContent />
      case "materials":
        return <ManageMaterialsContent />
      case "assignments":
        return <ManageAssignmentsContent />
      case "submissions":
        return <ManageSubmissionsContent />
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
        <span className="font-bold text-lg">Admin Panel</span>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          {[
            { id: "beranda", icon: Home, label: "Beranda" },
            { id: "users", icon: Users, label: "Manajemen User" },
            { id: "materials", icon: BookOpen, label: "Manajemen Materi" },
            { id: "assignments", icon: Layout, label: "Manajemen Latihan" },
            { id: "submissions", icon: Upload, label: "Pengumpulan Projek" }
          ].map(({ id, icon: Icon, label }) => (
            <li key={id}>
              <button
                onClick={() => setActiveMenu(id)}
                className={`flex items-center space-x-2 w-full py-2 px-3 rounded-lg transition-colors ${activeMenu === id
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:text-green-600 hover:bg-green-50"
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
                <AvatarImage src="/placeholder.svg" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-grow text-left">
                <p className="font-semibold">Admin</p>
                <p className="text-sm text-gray-500">admin@komandro.com</p>
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