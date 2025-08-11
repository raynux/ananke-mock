import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { PanelLeft, Search, Users, FileText, History, SettingsIcon } from "lucide-react"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ananke - 候補者推薦システム",
  description: "人事部門向けのAI搭載候補者推薦システム。",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
              <nav className="flex flex-col items-start gap-4 px-4 sm:py-5">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
                >
                  <PanelLeft className="h-6 w-6" />
                  <span className="text-lg font-bold">Ananke</span>
                </Link>
                <Link
                  href="/"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Search className="h-4 w-4" />
                  AI検索
                </Link>
                <Link
                  href="/candidate-database"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Users className="h-4 w-4" />
                  候補者データ
                </Link>
                <Link
                  href="/context-management"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <FileText className="h-4 w-4" />
                  コンテキスト管理
                </Link>
                <Link
                  href="/execution-logs"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <History className="h-4 w-4" />
                  実行ログ
                </Link>
                <Link
                  href="/settings"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <SettingsIcon className="h-4 w-4" />
                  設定
                </Link>
              </nav>
            </aside>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:ml-60">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden bg-transparent">
                      <PanelLeft className="h-5 w-5" />
                      <span className="sr-only">メニューを開閉</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                      <Link
                        href="/"
                        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                      >
                        <PanelLeft className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">Ananke</span>
                      </Link>
                      <Link
                        href="/"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <Search className="h-5 w-5" />
                        AI検索
                      </Link>
                      <Link
                        href="/candidate-database"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <Users className="h-5 w-5" />
                        候補者データ
                      </Link>
                      <Link
                        href="/context-management"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <FileText className="h-5 w-5" />
                        コンテキスト管理
                      </Link>
                      <Link
                        href="/execution-logs"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <History className="h-5 w-5" />
                        実行ログ
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <SettingsIcon className="h-5 w-5" />
                        設定
                      </Link>
                    </nav>
                  </SheetContent>
                </Sheet>
              </header>
              <main className="grid flex-1 items-start gap-4 p-4 sm:py-0 md:gap-8">{children}</main>
            </div>
          </div>
        </Suspense>
      </body>
    </html>
  )
}
