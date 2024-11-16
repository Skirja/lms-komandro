import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Admin Dashboard | LMS Komandro',
  description: 'Admin dashboard for LMS Komandro'
}

export default function AdminPage() {
  return <AdminDashboard />
}