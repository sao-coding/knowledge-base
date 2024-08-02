"use client"
import React from "react"
import { SendIcon } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

const ChatPage = ({ params }: { params: { id: string } }) => {
  // messages
  // [
  //   {
  //     id
  //     message
  //   }
  // ]

  type Message = {
    id: string
    role: "user" | "bot"
    message: string
  }

  type Conversation = {
    id: string
    title: string
    conversations: Message[]
    create_time: string
  }

  const [messages, setMessages] = React.useState<Conversation["conversations"]>([])

  React.useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/chat?id=${params.id}`)
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

    const res = await fetch("/api/chat?type=chat", {
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
        <div className='h-full'>
          <div className='flex flex-col gap-2 p-3 md:gap-3 lg:gap-4 xl:gap-5'>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
              >
                <div
                  className={`flex items-center justify-center rounded-lg p-2 ${
                    msg.role === "user" ? "bg-primary text-white" : "bg-secondary text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
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
