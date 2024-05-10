"use client"

import { UserRole } from "@prisma/client"
import { toast } from "sonner"
import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/role-gate"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const AdminPage = () => {
  const onApiRouteClick = () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("API Route succeeded!")
      } else {
        toast.error("API Route failed!")
      }
    })
  }

  const onServerActionClick = () => {
    admin().then((res) => {
      if (res.error) {
        toast.error(res.error)
      }

      if (res.success) {
        toast.success(res.success)
      }
    })
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.CHILD}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage
