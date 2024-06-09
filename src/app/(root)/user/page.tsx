'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Fetch } from '@/lib/fetch'
import Image from 'next/image'
import { USER } from '@/lib/types'

const UserPage = () => {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
    hasPre: false,
    hasNext: false
  })
  const [dialogDetails, setDialogDetails] = useState({
    open: false,
    id: ''
  })
  const [list, setList] = useState()

  useEffect(() => {
    try {
      Fetch({
        url: '/api/user',
        type: 'GET',
        data: { page: params.page, pageSize: params.pageSize }
      }).then(data => {
        setList(data.list)
      })
    } catch (error) {}
  }, [params.page, params.pageSize])

  const handleDelete = async (id: string) => {
    // TODO: delete user
  }

  const handlePagination = (type: 'NEXT' | 'PREV') => {
    if (type === 'NEXT' && params.hasNext) {
      const page = params.page + 1
      setParams({
        ...params,
        page: page,
        hasPre: page > 1 ? true : false
      })
      return
    }
    const page = params.page - 1
    if (page > 0) {
      setParams({
        ...params,
        page: page,
        hasPre: page > 1 ? true : false,
        hasNext: true
      })
    } else {
      setParams({ ...params, hasPre: false })
    }
  }
  return (
    <div>
      <h4>USER LIST</h4>
      <Table>
        <TableCaption>A list of your recent users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nickname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Operations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(list || []).map((item: USER) => (
            <TableRow key={item.id}>
              <TableCell className='font-medium'>
                {item?.image && (
                  <Image src={item.image} alt='' width={60} height={60} />
                )}
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                {/* <Button
                  onClick={() => {
                    setDialogDetails({
                      ...dialogDetails,
                      open: true,
                      id: item._id!
                    })
                  }}
                  variant='secondary'
                >
                  DELETE
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex items-center justify-end'>
        <Button size='sm' variant='link'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15.75 19.5L8.25 12l7.5-7.5'
            />
          </svg>
        </Button>
        <Button
          size='sm'
          disabled={params.hasPre ? false : true}
          variant='link'
          onClick={() => handlePagination('PREV')}
        >
          PRE
        </Button>
        <Button
          size='sm'
          disabled={params.hasNext ? false : true}
          variant='link'
          onClick={() => handlePagination('NEXT')}
        >
          NEXT
        </Button>
        <Button size='sm' variant='link'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M8.25 4.5l7.5 7.5-7.5 7.5'
            />
          </svg>
        </Button>
      </div>

      <Dialog
        open={dialogDetails.open}
        onOpenChange={(open: boolean) => {
          !open && setDialogDetails({ open: open, id: '' })
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              Are you sure delete this user?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                handleDelete(dialogDetails.id!)
              }}
            >
              CONFIRM
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserPage
