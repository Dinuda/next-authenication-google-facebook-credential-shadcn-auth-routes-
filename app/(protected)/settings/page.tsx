import { SettingsForm } from "@/components/auth/settings-form"
import { currentUser } from "@/lib/auth"
import { ExtendedUser } from "@/types"

const SettingsPage = async () => {
  const user = (await currentUser()) as ExtendedUser
  return <SettingsForm user={user} />
}

export default SettingsPage
