export type Message = {
  id: string
  role: "user" | "bot"
  message: string
  time: string
}

export type Conversation = {
  id: string
  title: string
  conversations: Message[]
  create_time: string
}
