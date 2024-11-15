import React from "react"
import { Plus, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddUserDialog } from "./add-user-dialog"

interface User {
  id: string
  name: string
  email: string
  role: string
  track: string | null
}

interface UsersContentProps {
  users: User[]
  isAddUserOpen: boolean
  setIsAddUserOpen: (open: boolean) => void
  isLoading: boolean
  handleCreateUser: (formData: any) => Promise<void>
  handleDeleteUser: (userId: string) => Promise<void>
}

export function UsersContent({
  users,
  isAddUserOpen,
  setIsAddUserOpen,
  isLoading,
  handleCreateUser,
  handleDeleteUser,
}: UsersContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsAddUserOpen(true)}>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <AddUserDialog
        isOpen={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSubmit={handleCreateUser}
        isLoading={isLoading}
      />

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.track}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <Button variant="ghost" size="sm">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
