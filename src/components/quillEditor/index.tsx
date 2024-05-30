import { useMemo, forwardRef } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { QuillModules, QuillFormats } from '@/lib/utils'

const QuillEditor = ({ ...props }) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  )

  return (
    <ReactQuill
      {...props}
      theme='snow'
      modules={QuillModules}
      formats={QuillFormats}
    />
  )
}

export default QuillEditor
