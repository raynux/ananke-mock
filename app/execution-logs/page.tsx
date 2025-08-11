import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const logData = `
[2025-08-11 02:15:00] INFO: クエリ「figma経験のあるフロントエンド開発者」でAI検索が開始されました。
[2025-08-11 02:15:01] INFO: 3人の潜在的な候補者が見つかりました。
[2025-08-11 02:15:02] INFO: 経験とスキルに基づいて候補者をランク付けしています。
[2025-08-11 02:15:03] INFO: ユーザー向けの推薦が生成されました。
[2025-08-11 02:18:21] INFO: CSVアップロード開始: candidates_new.csv。
[2025-08-11 02:18:25] INFO: 50件の新しい候補者プロファイルを処理中。
[2025-08-11 02:18:30] INFO: CSVアップロードが正常に完了しました。50人の候補者が追加されました。
[2025-08-11 02:20:05] WARN: 候補者ID: E-INVALID のマスキングに失敗しました。スキップします。
`

export default function ExecutionLogsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>実行ログ</CardTitle>
        <CardDescription>アプリケーションプロセスのログを確認します。</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
          <code>{logData.trim()}</code>
        </pre>
      </CardContent>
    </Card>
  )
}
