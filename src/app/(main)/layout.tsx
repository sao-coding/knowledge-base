import LeftSidebar from "./LeftSidebar"

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex h-full'>
      <div className='h-dvh w-64 border-r px-3'>
        <LeftSidebar />
      </div>
      <main className='relative flex h-dvh flex-1 flex-col overflow-auto'>{children}</main>
    </div>
  )
}
