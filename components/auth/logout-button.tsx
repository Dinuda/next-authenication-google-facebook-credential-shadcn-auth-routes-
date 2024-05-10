"use client"

import { logout } from "@/actions/logout"

interface LogoutButtonProps {
  children?: React.ReactNode
}

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout()
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  )
}

export default LogoutButton
