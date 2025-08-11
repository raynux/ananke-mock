"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ContextManagementPage() {
  const [context, setContext] = useState(
    "理想的な候補者は、フルスタック開発に重点を置いたソフトウェアエンジニアリングの強力なバックグラウンドを持っている必要があります。主要な技術には、React、Node.js、PostgreSQLが含まれます。私たちは協調性、革新性、そして積極的な姿勢を重視します。",
  )
  const { toast } = useToast()

  const handleUpdate = () => {
    // Here you would typically save the context to a backend
    console.log("Updated context:", context)
    toast({
      title: "コンテキストが更新されました",
      description: "コンテキスト情報が正常に保存されました。",
    })
  }

  return (
    <>
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>コンテキスト管理</CardTitle>
          <CardDescription>AIの推薦をガイドするためのコンテキスト情報を提供します。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Textarea
              placeholder="ここにコンテキスト情報を入力してください..."
              className="min-h-[300px]"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleUpdate}>コンテキストを更新</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
