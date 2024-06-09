'use client'

import Link from 'next/link'
import * as z from 'zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { LoginValidation } from '@/lib/validations/user'

const Page = () => {
  const form = useForm({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof LoginValidation>) => {
    const { email, password } = values
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/blog'
      })
    } catch (error) {
      console.log('error', JSON.stringify(error))
    }
  }

  return (
    <div className='flex items-center justify-center px-5 py-10 rounded-md shadow-md'>
      <div className='p-10 bg-slate-300 rounded-md'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col justify-start gap-10'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Please enter email'
                      {...field}
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Please enter your password'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center justify-start'>
              <Button type='submit' className='text-white w-full'>
                Sign in
              </Button>
            </div>
          </form>
        </Form>

        <div className='flex items-center justify-items-center my-2'>
          <hr className='w-1/2' />
          <span className='w-14 text-center'>or</span>
          <hr className='w-1/2' />
        </div>

        <div>
          <Button
            type='button'
            className='w-full'
            onClick={(event: React.MouseEvent) => {
              event.preventDefault()
              signIn('google', { callbackUrl: '/blog' })
            }}
          >
            Sign in with Google
          </Button>
          <p>
            If you don&apos;t have an account, please{' '}
            <Link href='/register' className='text-link'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
