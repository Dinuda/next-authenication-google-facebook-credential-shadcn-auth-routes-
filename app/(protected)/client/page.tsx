"use client"

import { UserInfo } from "@/components/user-info"
import { useCurrentUser } from "@/hooks/use-current-user"
import { ExtendedUser } from "@/types"

const ClientPage = () => {
  const user = useCurrentUser() as ExtendedUser

  return <UserInfo user={user} label="Server component" />
}

export default ClientPage
