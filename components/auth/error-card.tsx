import { TriangleAlertIcon } from "lucide-react"
import { CardWrapper } from "@/components/auth/card-wrapper"

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocial={false}
    >
      <div className="flex w-full items-center justify-center">
        <TriangleAlertIcon className="h-8 w-8 text-destructive" />
      </div>
    </CardWrapper>
  )
}
