// http://172.16.111.148:8088/chat
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

import { Conversation } from "@/types"

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id")
  if (id) {
    const conversations: Conversation[] = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "src/data/conversations.json"), "utf-8")
    )

    const conversation = conversations.find((c) => c.id === id)

    if (conversation) {
      return NextResponse.json(conversation)
    }
  }
}

export const POST = async (req: NextRequest) => {
  const type = req.nextUrl.searchParams.get("type") || "chat"
  const { user_id, chat_id, message } = await req.json()

  if (type === "chat") {
    const res = await fetch("http://172.16.111.148:8088/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id,
        chat_id,
        query: message
      })
    })

    const data = await res.json()

    console.log(data)

    // conversations
    const conversations: Conversation[] = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "src/data/conversations.json"), "utf-8")
    )

    // 把對話寫入 有對應的 chat_id 中
    const conversation = conversations.find((c) => c.id === chat_id)

    console.log(conversation)

    if (conversation) {
      conversation.conversations.push({
        id: data.id,
        role: "user",
        message,
        time: new Date().toISOString()
      })

      // 機器人回覆
      conversation.conversations.push({
        id: data.id,
        role: "bot",
        message: data.output,
        time: new Date().toISOString()
      })

      fs.writeFileSync(
        path.resolve(process.cwd(), "src/data/conversations.json"),
        JSON.stringify(conversations, null, 2)
      )
    }

    return NextResponse.json({
      id: data.id,
      role: "bot",
      message: data.output,
      time: new Date().toISOString()
    })
  }

  return NextResponse.json({ message: "Failed" })
}
