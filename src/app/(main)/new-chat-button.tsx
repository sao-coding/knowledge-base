"use client"

import { useRouter } from "next/navigation"
import { SquarePenIcon } from "lucide-react"
import toast from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"

import { useQueryClient } from "@tanstack/react-query"

const NewChatButton = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const newChat = async () => {
    const id = uuidv4()
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        title: "New Chat",
        create_time: new Date().toISOString()
      })
    })
    const data = await res.json()
    if (data.message === "Success") {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      router.push(`/chat/${id}`)
    } else {
      toast.error("新增對話失敗")
    }
  }

  return (
    <button
      className='flex h-10 items-center rounded-lg px-2 hover:hover:bg-accent'
      onClick={newChat}
    >
      <SquarePenIcon />
    </button>
  )
}

export default NewChatButton
