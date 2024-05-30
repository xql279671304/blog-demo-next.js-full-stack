'use client'

import { useEffect } from 'react'
import * as z from 'zod'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { BlogValidation } from '@/lib/validations/blog'
import { Fetch } from '@/lib/fetch'
import { toast } from '@/components/ui/use-toast'

import UploadImage from '@/components/uploadImage'
import QuillEditor from '@/components/quillEditor'

export default function BlogDetailPage () {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(BlogValidation),
    defaultValues: {
      name: '',
      image: '',
      brief: '',
      content: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof BlogValidation>) => {
    try {
      const data = await Fetch({
        url: '/api/blog',
        type: id ? 'PATCH' : 'POST',
        data: id ? { ...values, id } : { ...values }
      })
      if (data) {
        toast({ description: 'operation successfully.' })
        router.push('/blog')
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (id) {
      Fetch({ url: '/api/blog/' + id, type: 'GET' }).then((data: any) => {
        const { name = '', image = '', brief = '', content = '' } = data
        form.reset({ name, image, brief, content })
      })
    }
  }, [id])

  return (
    <div>
      <Form {...form}>
        <form className='mt-10' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid grid-cols-5 gap-12'>
            <div className='col-span-2 flex flex-col justify-start gap-10'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Please enter name' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Head Image</FormLabel>
                    <FormControl>
                      <UploadImage
                        field={{ ...field }}
                        onChange={baseString => {
                          form.setValue('image', baseString)
                        }}
                      />
                    </FormControl>
                    {field.value && (
                      <Image
                        priority={false}
                        alt='head img'
                        src={field.value}
                        width={150}
                        height={150}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='brief'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brief</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Type brief.' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-3'>
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <QuillEditor
                        {...field}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='flex items-center justify-start'>
            <Button type='submit' className='text-white'>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
