import Link from 'next/link'
import AuthForm from '../components/AuthForm'

export default function Register() {
  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-center items-center">
      <div className="text-center mb-4">
        <h1 className="font-extrabold text-3xl">Register</h1>
        <p>Create your account to start ordering</p>
      </div>
      <div className="bg-card border border-ring shadow-md rounded-2xl">
        <AuthForm mode="register" />
        <p className="text-center mt-4 mb-8">
          Already have an account?{' '}
          <Link href="/login" className="hover:underline text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
