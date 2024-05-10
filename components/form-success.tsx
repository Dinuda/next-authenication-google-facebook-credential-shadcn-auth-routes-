import { CheckCircle } from "lucide-react"

interface FormSuccessProps {
  message?: string
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null

  return (
    <div className="text-success flex items-center gap-x-2 rounded-md bg-green-100 p-3 text-green-800">
      <CheckCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
