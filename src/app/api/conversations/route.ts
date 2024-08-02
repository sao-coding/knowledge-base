import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const GET = async (req: NextRequest) => {
  // 讀取 src/data/conversations.json
  const conversations = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "src/data/conversations.json"), "utf-8")
  )
  console.log(conversations)

  // 用時間降冪排序
  conversations.sort(
    (a: any, b: any) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime()
  )

  return NextResponse.json(conversations)
}

export const POST = async (req: NextRequest) => {
  // 寫入 conversations.json
  //   {
  //     id
  //     title
  //     create_time
  //   }
  const { id, title, create_time } = await req.json()
  try {
    const conversations = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "src/data/conversations.json"), "utf-8")
    )
    conversations.push({
      id,
      title,
      conversations: [],
      create_time
    })
    fs.writeFileSync(
      path.resolve(process.cwd(), "src/data/conversations.json"),
      JSON.stringify(conversations, null, 2)
    )
    return NextResponse.json({ message: "Success" })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Failed" })
  }
}

export const DELETE = async (req: NextRequest) => {
  // 刪除 conversations.json 中的一筆資料
  const { id } = await req.json()

  const res = await fetch(`${process.env.API_URL}/clean`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: id,
      section: "chat"
    })
  })

  // 回傳值為 status true false
  const data = await res.json()

  if (data.status) {
    const conversations = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "src/data/conversations.json"), "utf-8")
    )
    const newConversations = conversations.filter((conversation: any) => conversation.id !== id)
    fs.writeFileSync(
      path.resolve(process.cwd(), "src/data/conversations.json"),
      JSON.stringify(newConversations, null, 2)
    )
    return NextResponse.json({ message: "Success" })
  } else {
    return NextResponse.json({ message: "Failed" })
  }
}
