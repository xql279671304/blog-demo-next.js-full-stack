import { Input } from '@/components/ui/input'
import * as React from 'react'
import { ControllerRenderProps } from 'react-hook-form'

interface Props {
  onChange: (baseString: string) => void
  field: ControllerRenderProps
}

export default function UploadImage ({ onChange, ...field }: Props) {
  return (
    <Input
      {...field}
      type='file'
      placeholder='Please choose a image'
      accept='image/*'
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files ? event.target.files[0] : null
        if (file) {
          const reader = new FileReader()
          reader.onload = function (e: ProgressEvent<FileReader>) {
            const base64String = e?.target?.result
            typeof base64String === 'string' && onChange(base64String)
          }
          reader.readAsDataURL(file)
        }
      }}
    />
  )
}
