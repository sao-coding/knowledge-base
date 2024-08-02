"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { EllipsisIcon, Trash2Icon } from "lucide-react"
import toast from "react-hot-toast"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import NewChatButton from "./new-chat-button"

const LeftSidebar = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["list"],
    queryFn: async () => {
      const res = await fetch("/api/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      return await res.json()
    }
  })

  const router = useRouter()
  const queryClient = useQueryClient()

  const deleteConversation = async (id: string) => {
    const res = await fetch("/api/list", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    })

    const data = await res.json()

    if (data.message === "Success") {
      queryClient.invalidateQueries({ queryKey: ["list"] })
      router.push("/")
    } else {
      toast.error("刪除失敗")
    }
  }

  return (
    <>
      <div className='flex h-14 items-center justify-between'>
        <div className='px-2 text-xl'>Knowledge Base</div>
        <NewChatButton />
      </div>
      <div className='mt-4'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {data.map((conversation: any) => (
              <div key={conversation.id} className='relative'>
                <Link
                  href={`/chat/${conversation.id}`}
                  className='inline-flex h-10 w-full items-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                >
                  <div className=''>{conversation.title}</div>
                </Link>
                <div className='absolute bottom-0 right-4 top-0 flex items-center'>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisIcon className='h-5 w-5 text-gray-500 hover:text-gray-700' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                      <DropdownMenuLabel>設定</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='text-red-500 focus:bg-red-500 focus:text-white'
                        onClick={() => deleteConversation(conversation.id)}
                      >
                        <Trash2Icon className='h-5 w-5' />
                        <span className='ml-2'>刪除</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default LeftSidebar
