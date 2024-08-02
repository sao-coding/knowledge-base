"use client"
import React from "react"
import clsx from "clsx"
import { BrainIcon, SendIcon } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Conversation } from "@/types"

const ChatPage = ({ params }: { params: { id: string } }) => {
  // messages
  // [
  //   {
  //     id
  //     message
  //   }
  // ]

  const [messages, setMessages] = React.useState<Conversation["conversations"]>([])

  React.useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/conversations?id=${params.id}`)
      const data = await res.json()
      setMessages(data.conversations)
    }
    fetchMessages()
  }, [])

  const sendMessage = async () => {
    const textArea = document.querySelector("#message") as HTMLTextAreaElement
    const message = textArea.value
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), role: "user", message, time: new Date().toISOString() }
    ])
    textArea.value = ""

    const res = await fetch("/api/conversations?type=chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: params.id,
        user_id: "10019878",
        message
      })
    })
    const data = await res.json()
    console.log(data)

    setMessages((prev) => [
      ...prev,
      { id: data.id, role: "bot", message: data.message, time: data.time }
    ])
  }

  return (
    <>
      <div className='flex-1 overflow-hidden'>
        <div className='h-full overflow-y-auto'>
          <div className='flex flex-col'>
            <div className='sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-3 md:px-5 lg:px-1 xl:px-5'>
              <div className='flex items-center'>
                <div className='text-lg font-semibold text-gray-500'>模型：</div>
                <Select>
                  <SelectTrigger className='w-40 border-none'>
                    <SelectValue placeholder='聊天' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='chat'>聊天</SelectItem>
                    <SelectItem value='search'>搜尋</SelectItem>
                    <SelectItem value='summary'>摘要</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='mx-auto flex flex-1 gap-4 text-base md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]'>
              <div className='flex flex-col gap-2 p-3 md:gap-3 lg:gap-4 xl:gap-5'>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={clsx("flex gap-4", {
                      "justify-end": msg.role === "user",
                      "justify-start": msg.role === "bot"
                    })}
                  >
                    {/* 角色是 機器人才會顯示頭像 使用者不顯示 */}
                    {msg.role === "bot" && (
                      <div className='flex flex-col items-end'>
                        <div className='rounded-full border-2 border-primary p-1'>
                          <BrainIcon className='h-5 w-5' />
                        </div>
                      </div>
                    )}
                    <div
                      className={clsx(
                        "flex items-center justify-center rounded-lg p-2",
                        msg.role === "user" ? "bg-primary text-white" : "bg-secondary text-black"
                      )}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='my-2 px-3 text-base md:px-5 lg:px-1 xl:px-5'>
        <div className='mx-auto flex flex-1 gap-4 rounded-full bg-secondary text-base md:max-w-3xl md:gap-5 lg:max-w-[40rem] lg:gap-6 xl:max-w-[48rem]'>
          <div className='flex min-w-0 flex-1 flex-col'>
            <div className='flex items-end gap-1.5 p-1.5 md:gap-2'>
              <textarea
                name=''
                id='message'
                className='mx-2 h-10 max-h-[25dvh] w-full resize-none border-0 bg-transparent px-0 py-2 focus:outline-none focus:ring-0 focus-visible:ring-0'
                placeholder='傳訊息給GPT'
              />
              <div className='mb-0.5'>
                <button
                  className='flex cursor-pointer items-center justify-center rounded-full bg-black p-2'
                  onClick={sendMessage}
                >
                  <SendIcon className='h-5 w-5 text-white' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatPage
