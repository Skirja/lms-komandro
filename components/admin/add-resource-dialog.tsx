"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface AddResourceDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddResourceDialog({
  isOpen,
  onClose,
}: AddResourceDialogProps) {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/admin/add-resource")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Learning Resource</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Create Resource
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
