import Link from 'next/link'
import AuthForm from '../components/AuthForm'

export default function Login() {
  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-center items-center">
      <div className="text-center mb-4">
        <h1 className="font-extrabold text-3xl">Login</h1>
        <p>Please login to continue</p>
      </div>
      <div className="bg-card border border-ring shadow-md rounded-2xl">
        <AuthForm mode="login" />
        <p className="text-center mt-4 mb-8">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="hover:underline text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
