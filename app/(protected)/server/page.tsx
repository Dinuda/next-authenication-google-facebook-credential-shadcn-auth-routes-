import { UserInfo } from "@/components/user-info"
import { currentUser } from "@/lib/auth"

const ServerPage = async () => {
  const user = await currentUser()

  return <UserInfo user={user} label="Server component" />
}

export default ServerPage
