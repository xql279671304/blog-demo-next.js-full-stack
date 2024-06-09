'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

import { Fetch } from '@/lib/fetch'
import { toast } from '@/components/ui/use-toast'

const BlogPage = () => {
  const router = useRouter()
  const [params, setParams] = useState({ page: 1, pageSize: 20 })
  const [totalCount, setTotalCount] = useState(0)
  const [list, setList] = useState()

  useEffect(() => {
    try {
      Fetch({
        url: '/api/blog',
        type: 'GET',
        data: { ...params }
      }).then(data => {
        setList(data.list)
        setTotalCount(data.totalCount)
      })
    } catch (error) {}
  }, [params])

  return (
    <div>
      <div>
        <Button
          variant='outline'
          onClick={() => {
            router.push('/blog/detail')
          }}
        >
          {' '}
          + Create New Blog
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Create Time</TableHead>
            <TableHead className='text-right'>Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(list || []).map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>
                {(item?.image ?? '') && (
                  <Image
                    alt='head image'
                    priority={false}
                    src={item.image}
                    width={400}
                    height={100}
                  />
                )}
              </TableCell>
              <TableCell className='font-medium'>{item.name}</TableCell>
              <TableCell className='font-medium'>{item.createdAt}</TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='outline'
                  className='mr-6'
                  onClick={() => {
                    router.push('/blog/detail/' + item.id)
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    Fetch({
                      url: '/api/blog',
                      type: 'DELETE',
                      data: { id: item.id }
                    }).then(() => {
                      toast({
                        variant: 'default',
                        description: 'deleted successfully.'
                      })
                    })
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              onClick={event => {
                event.preventDefault()
                if (params.page > 1) {
                  setParams({ ...params, page: params.page - 1 })
                }
              }}
            />
          </PaginationItem>
          {params.page >= 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {params.page - 1 > 0 && (
            <PaginationItem>
              <PaginationLink
                href='#'
                onClick={event => {
                  event.preventDefault()
                  setParams({ ...params, page: params.page - 1 })
                }}
              >
                {params.page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href='#' isActive>
              {params.page}
            </PaginationLink>
          </PaginationItem>
          {params.page + 1 <= Math.ceil(totalCount / params.pageSize) && (
            <PaginationItem>
              <PaginationLink
                href='#'
                onClick={event => {
                  event.preventDefault()
                  setParams({ ...params, page: params.page + 1 })
                }}
              >
                {params.page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {params.page + 2 < Math.ceil(totalCount / params.pageSize) && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href='#'
              onClick={event => {
                event.preventDefault()
                if (params.page * params.pageSize < totalCount) {
                  setParams({ ...params, page: params.page + 1 })
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default BlogPage
