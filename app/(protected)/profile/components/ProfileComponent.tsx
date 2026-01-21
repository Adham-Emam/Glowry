'use client'

import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import {
  User,
  Phone,
  MapPin,
  Home,
  Globe,
  Mail,
  Save,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateProfile } from '@/supabase/profile'
import { createClient } from '@/supabase/conf/client'
import { cn } from '@/lib/utils'

const ProfileSchema = Yup.object().shape({
  full_name: Yup.string().required('Required'),
  phone: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  street: Yup.string().required('Required'),
  state: Yup.string().nullable(),
  building: Yup.string().nullable(),
  apartment: Yup.string().nullable(),
  postal_code: Yup.string().nullable(),
  delivery_notes: Yup.string().nullable(),
})

export default function ProfileComponent() {
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const formik = useFormik({
    initialValues: {
      full_name: '',
      phone: '',
      country: '',
      city: '',
      state: '',
      street: '',
      building: '',
      apartment: '',
      postal_code: '',
      delivery_notes: '',
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values) => {
      const res = await updateProfile(values)
      if (res.error) {
        console.log(res.error)
        toast.error(res.error)
      } else toast.success('Profile and Address updated!')
    },
  })

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const [prof, addr] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_default', true)
            .maybeSingle(),
        ])

        if (prof.data || addr.data) {
          formik.setValues({
            full_name: prof.data?.full_name || '',
            phone: prof.data?.phone || '',
            country: addr.data?.country || '',
            city: addr.data?.city || '',
            state: addr.data?.state || '',
            street: addr.data?.street || '',
            building: addr.data?.building || '',
            apartment: addr.data?.apartment || '',
            postal_code: addr.data?.postal_code || '',
            delivery_notes: addr.data?.delivery_notes || '',
          })
        }
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    )

  return (
    <div className="container max-w-4xl py-8">
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <section className="bg-card border rounded-3xl p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputItem
              label="Full Name"
              name="full_name"
              formik={formik}
              Icon={User}
            />
            <InputItem
              label="Phone Number"
              name="phone"
              formik={formik}
              Icon={Phone}
            />
          </div>
        </section>

        {/* Address Details */}
        <section className="bg-card border rounded-3xl p-8 space-y-6 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Shipping Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputItem
              label="Country"
              name="country"
              formik={formik}
              Icon={Globe}
            />
            <InputItem label="City" name="city" formik={formik} Icon={MapPin} />
            <InputItem label="State / Region" name="state" formik={formik} />

            <div className="md:col-span-2">
              <InputItem
                label="Street Address"
                name="street"
                formik={formik}
                Icon={Home}
              />
            </div>
            <InputItem
              label="Postal Code"
              name="postal_code"
              formik={formik}
              Icon={Mail}
            />

            <InputItem
              label="Building Name/No"
              name="building"
              formik={formik}
            />
            <InputItem
              label="Apartment / Suite"
              name="apartment"
              formik={formik}
            />

            <div className="md:col-span-3">
              <label className="text-xs font-bold uppercase ml-1 opacity-60">
                Delivery Notes
              </label>
              <textarea
                {...formik.getFieldProps('delivery_notes')}
                className="w-full mt-1 p-4 bg-muted/50 border-none rounded-2xl min-h-25 outline-none focus:ring-2 ring-primary/20"
                placeholder="Special instructions for delivery..."
              />
            </div>
          </div>
        </section>

        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full py-3 bg-primary rounded-2xl text-lg font-bold"
        >
          {formik.isSubmitting ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Save className="mr-2" />
          )}
          Update Profile & Address
        </Button>
      </form>
    </div>
  )
}

function InputItem({ label, name, formik, Icon }: any) {
  const isError = formik.touched[name] && formik.errors[name]
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase ml-1 opacity-60">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        )}
        <input
          {...formik.getFieldProps(name)}
          className={cn(
            'w-full py-3 bg-muted/50 border rounded-2xl focus:ring-2 transition-all outline-none',
            Icon ? 'pl-12 pr-4' : 'px-4',
            isError
              ? 'border-destructive ring-destructive/10'
              : 'border-transparent focus:border-primary ring-primary/20',
          )}
        />
      </div>
      {isError && (
        <span className="text-[10px] text-destructive font-bold ml-2">
          {formik.errors[name]}
        </span>
      )}
    </div>
  )
}
