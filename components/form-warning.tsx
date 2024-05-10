import { TriangleAlertIcon } from "lucide-react"

interface FormSuccessProps {
  message?: string
}

export const FormWarning = ({ message }: FormSuccessProps) => {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-yellow-100 p-3 text-sm text-yellow-700">
      <TriangleAlertIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
