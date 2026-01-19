'use client'

import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { login, register } from '@/supabase/auth'
import { useAuth } from '@/supabase/hooks/useAuth'
import { toast } from 'sonner'
import { use, useEffect } from 'react'

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

const registerValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      'Password must be at least 8 characters long and contain at least one letter and one number',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
})

type AuthValues = {
  email: string
  password: string
  confirmPassword?: string
}

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/')
    }
  }, [loading, isAuthenticated, router])

  const handleSubmit = async (values: AuthValues) => {
    const { email, password } = values

    const { error }: any =
      mode === 'login'
        ? await login(email, password)
        : await register(email, password)

    if (error) toast.error(error.message)
    else
      toast.success(
        mode === 'login' ? 'Logged in successfully' : 'Registered successfully',
      )
  }

  return (
    <Formik
      initialValues={
        mode === 'login'
          ? {
              email: '',
              password: '',
            }
          : {
              email: '',
              password: '',
              confirmPassword: '',
            }
      }
      validationSchema={
        mode === 'login' ? loginValidationSchema : registerValidationSchema
      }
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true)
        await handleSubmit(values)
        setSubmitting(false)
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="w-[90vw] md:w-125 px-4 pt-8 flex flex-col items-center justify-center gap-4">
          <div className="w-full flex flex-col gap-1 mx-0">
            <label htmlFor="email">Email</label>
            <Field
              name="email"
              className="border rounded-2xl px-4 py-2 outline-none w-full duration-300 focus:border-primary"
            />
            {touched.email && errors.email && (
              <div className="text-destructive">{errors.email}</div>
            )}
          </div>

          <div className="w-full flex flex-col gap-1 mx-0">
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              type="password"
              className="border rounded-2xl px-4 py-2 outline-none w-full duration-300 focus:border-primary"
            />
            {touched.password && errors.password && (
              <div className="text-destructive">{errors.password}</div>
            )}
          </div>

          {mode === 'register' && (
            <div className="w-full flex flex-col gap-1 mx-0">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="border rounded-2xl px-4 py-2 outline-none w-full duration-300 focus:border-primary"
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="text-destructive">{errors.confirmPassword}</div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin" />
            ) : mode === 'login' ? (
              'Login'
            ) : (
              'Register'
            )}
          </Button>
        </Form>
      )}
    </Formik>
  )
}
