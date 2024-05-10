"use client"

import { LogOut, User2Icon } from "lucide-react"
import LogoutButton from "@/components/auth/logout-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"

export const UserButton = () => {
  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} alt="User avatar" />
          <AvatarFallback className="bg-sky-500">
            <User2Icon className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <LogoutButton>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
