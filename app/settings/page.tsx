"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const initialYamlConfig = `
# AIモデル設定
model:
  provider: 'openai'
  name: 'gpt-4o'
  temperature: 0.5

# データベース設定
database:
  type: 'postgresql'
  host: 'db.ananke.internal'
  port: 5432

# 検索パラメータ
search:
  default_results: 5
  relevance_threshold: 0.7
`

export default function SettingsPage() {
  const [config, setConfig] = useState(initialYamlConfig.trim())
  const { toast } = useToast()

  const handleUpdate = () => {
    // Here you would validate and save the YAML config
    console.log("Updated config:", config)
    toast({
      title: "設定が更新されました",
      description: "設定が正常に保存されました。",
    })
  }

  return (
    <>
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>設定</CardTitle>
          <CardDescription>以下のYAMLファイルでアプリケーション構成を管理します。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Textarea
              placeholder="ここにYAML設定を入力してください..."
              className="min-h-[300px] font-mono text-sm"
              value={config}
              onChange={(e) => setConfig(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleUpdate}>設定を更新</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
