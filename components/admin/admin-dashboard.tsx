"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { useState, useEffect } from "react"
import { ProjectsContent } from "./projects-content"
import { UsersContent } from "./users-content"
import { ResourcesContent } from "./resources-content"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import Image from "next/image"

interface User {
  id: string
  name: string
  email: string
  role: string
  track: string | null
}

interface CreateUserData {
  name: string
  email: string
  password: string
  role: string
  track?: string
}

export function AdminDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState<User[]>([])
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      if (response.ok) {
        setUsers(data)
      } else {
        toast.error("Failed to fetch users")
      }
    } catch {
      toast.error("Error fetching users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (formData: CreateUserData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("User created successfully")
        setIsAddUserOpen(false)
        fetchUsers()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to create user")
      }
    } catch {
      toast.error("Error creating user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("User deleted successfully")
        fetchUsers()
      } else {
        toast.error("Failed to delete user")
      }
    } catch {
      toast.error("Error deleting user")
    }
  }

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image
            src="/images/Logo.png"
            alt="LMS Logo"
            width={40}
            height={40}
            className="h-10"
          />
          <span className="font-bold text-lg">LMS Komandro</span>
        </div>
        <Button variant="ghost" className="relative h-10">
          <div className="flex flex-col items-start">
            <span className="font-medium">{session?.user?.name}</span>
            <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
          </div>
          <ChevronUp className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      <Tabs defaultValue={activeTab} className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="learning-resources">Learning Resources</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Recent user activities and submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <UsersContent
            users={users}
            isAddUserOpen={isAddUserOpen}
            setIsAddUserOpen={setIsAddUserOpen}
            handleCreateUser={handleCreateUser}
            handleDeleteUser={handleDeleteUser}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <ProjectsContent />
        </TabsContent>
        <TabsContent value="learning-resources" className="space-y-4">
          <ResourcesContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}