import { Loader } from 'lucide-react'

export default function Loading() {
  return (
    <div className="bg-background w-full h-screen fixed top-0 left-0 flex justify-center items-center">
      <Loader className="animate-spin text-primary w-8 h-8" />
    </div>
  )
}
