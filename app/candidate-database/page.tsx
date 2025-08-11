"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Save, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type Candidate = {
  [key: string]: string | number
  id: string
  name: string
  email: string
  department: string
  position: string
  skills: string
  experience: number
  education: string
  projectHistory: string
  performanceReview: string
  notes: string
}

type TabKey = "original" | "processed" | "mapping"

const columnConfig: { key: keyof Candidate; name: string; isMultiLine?: boolean }[] = [
  { key: "id", name: "従業員ID" },
  { key: "name", name: "氏名" },
  { key: "email", name: "メールアドレス" },
  { key: "department", name: "部署" },
  { key: "position", name: "役職" },
  { key: "skills", name: "スキル" },
  { key: "experience", name: "経験年数" },
  { key: "education", name: "学歴", isMultiLine: true },
  { key: "projectHistory", name: "プロジェクト履歴", isMultiLine: true },
  { key: "performanceReview", name: "パフォーマンスレビュー", isMultiLine: true },
  { key: "notes", name: "備考", isMultiLine: true },
]

const initialCandidates: Candidate[] = [
  {
    id: "E123",
    name: "田中 太郎",
    email: "taro.tanaka@example.com",
    department: "技術部",
    position: "シニアデベロッパー",
    skills: "React, Node.js, TypeScript, AWS",
    experience: 5,
    education: "東京大学大学院 情報理工学系研究科 修了",
    projectHistory: "・プロジェクトX (リーダー)\n・社内ツール開発 (メイン担当)",
    performanceReview: "・技術力が高く、チームへの貢献も大きい。\n・若手の育成にも意欲的。",
    notes: "次期プロジェクトのリーダー候補。",
  },
  {
    id: "E456",
    name: "鈴木 花子",
    email: "hanako.suzuki@example.com",
    department: "製品部",
    position: "プロダクトマネージャー",
    skills: "アジャイル, スクラム, JIRA, Miro",
    experience: 7,
    education: "慶應義塾大学 経済学部 卒業",
    projectHistory: "・製品Aの立ち上げ\n・製品Bのグロース戦略",
    performanceReview: "・市場分析とユーザー理解に長けている。\n・関係各所との調整能力が高い。",
    notes: "ユーザーリサーチの専門家。",
  },
]

export default function CandidateDatabasePage() {
  // URL param hooks
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // タブ: URLの?tab= から現在値を取得（デフォルトoriginal）
  const currentTab = (() => {
    const t = (searchParams.get("tab") as TabKey) || "original"
    return t === "processed" || t === "mapping" ? t : "original"
  })()

  // 生データ（オリジナル）
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)

  // 加工済みタブの編集制御
  const [isEditableProcessed, setIsEditableProcessed] = useState(false)

  // アップロード/マスキング進捗
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMaskingModalOpen, setIsMaskingModalOpen] = useState(false)
  const [maskingProgress, setMaskingProgress] = useState(0)
  const [processedCount, setProcessedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // URLのtabを書き換えるユーティリティ
  const setTabInUrl = (tab: TabKey) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.push(`${pathname}?${params.toString()}`)
  }

  // ハンドル生成
  const handleFor = (id: string) => `@user-${String(id).toLowerCase()}`

  // 加工済み（表示時は自動マスキング）
  const maskedCandidates = useMemo(() => {
    return candidates.map((c) => ({
      ...c,
      name: handleFor(c.id),
      email: `${handleFor(c.id).slice(1)}@masked.example.com`,
    }))
  }, [candidates])

  // マッピング表（@user-xxx と元の文字列の対応）
  const mappingRows = useMemo(() => {
    return candidates.flatMap((c) => {
      const handle = handleFor(c.id)
      const maskedEmail = `${handle.slice(1)}@masked.example.com`
      return [
        { masked: handle, original: c.name }, // 氏名: @user-xxx ↔ 元氏名
        { masked: maskedEmail, original: c.email }, // メール: user-xxx@masked.example.com ↔ 元メール
      ]
    })
  }, [candidates])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    // ダミーCSV（実装簡易化のためファイル内容は読み込まず固定文字列を利用）
    const dummyCsvText = `id,name,email,department,position,skills,experience,education,projectHistory,performanceReview,notes
E801,新規 典子,noriko.shinki@example.com,営業部,営業担当,"交渉術・CRM",2,早稲田大学 商学部 卒業,"・新規顧客開拓 (月間目標120%達成)\n・既存顧客へのアップセル","・目標達成意欲が高い\n・コミュニケーション能力に優れる",新規顧客開拓が得意
E802,追加 祐介,yusuke.tsuika@example.com,マーケティング部,デジタルマーケター,"SEO・Google Analytics",4,京都大学 法学部 卒業,"・Webサイト改善プロジェクト\n・広告キャンペーン運用","・データ分析に基づく改善提案が得意\n・論理的思考力が高い",`

    const lines = dummyCsvText
      .split("\n")
      .slice(1)
      .filter((line) => line.trim() !== "")

    const headers = dummyCsvText.split("\n")[0].split(",")
    const parsed: Candidate[] = []

    lines.forEach((line, index) => {
      const values = line.split(",")
      const candidate = headers.reduce((obj, header, i) => {
        const key = header.trim() as keyof Candidate
        const value = values[i] || ""
        // @ts-ignore
        obj[key] = key === "experience" ? Number(value) || 0 : String(value).replace(/"/g, "")
        return obj
      }, {} as Candidate)

      if (candidate.id) parsed.push(candidate)
      setProgress(Math.round(((index + 1) / lines.length) * 100))
    })

    const total = parsed.length
    if (total === 0) {
      setUploading(false)
      return
    }

    // 自動マスキング進捗モーダル
    setTotalCount(total)
    setProcessedCount(0)
    setIsMaskingModalOpen(true)
    setMaskingProgress(0)

    const interval = setInterval(() => {
      setMaskingProgress((prev) => {
        const next = prev >= 95 ? 95 : prev + 5
        setProcessedCount(Math.min(total, Math.floor((total * next) / 100)))
        if (next >= 95) clearInterval(interval)
        return next
      })
    }, 180)

    setTimeout(() => {
      clearInterval(interval)
      setCandidates((prev) => [...prev, ...parsed])
      setMaskingProgress(100)
      setProcessedCount(total)
      setTimeout(() => {
        setIsMaskingModalOpen(false)
        setUploading(false)
        setTabInUrl("processed") // URLのタブを加工済みに変更
      }, 400)
    }, 3600)
  }

  const handleProcessedEdit = (row: number, field: keyof Candidate, value: string | number) => {
    setCandidates((prev) => {
      const copy = [...prev]
      copy[row] = { ...copy[row], [field]: value }
      return copy
    })
  }

  const handleSaveProcessed = () => {
    setIsEditableProcessed(false)
    console.log("保存（加工済みタブ）:", candidates)
  }

  const handleExportProcessed = () => {
    const headers = columnConfig.map((c) => c.name).join(",")
    const rows = maskedCandidates.map((candidate) =>
      columnConfig
        .map((col) => {
          let value = String(candidate[col.key])
          if (value.includes(",") || value.includes("\n")) value = `"${value.replace(/"/g, '""')}"`
          return value
        })
        .join(","),
    )
    const csvContent = [headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "candidates_processed.csv"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const renderCandidateTable = (
    data: Candidate[],
    editable: boolean,
    onEdit?: (row: number, field: keyof Candidate, value: string | number) => void,
  ) => (
    <div className="relative h-full w-full overflow-auto rounded-md border">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            {columnConfig.map((col) => (
              <TableHead key={col.key} className="min-w-[200px] bg-muted/50">
                {col.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((candidate, rowIndex) => (
            <TableRow key={rowIndex}>
              {columnConfig.map((col) => (
                <TableCell key={col.key} className="align-top">
                  {editable && onEdit ? (
                    col.isMultiLine ? (
                      <Textarea
                        value={String(candidates[rowIndex][col.key] ?? "")}
                        onChange={(e) => onEdit(rowIndex, col.key, e.target.value)}
                        className="min-h-[120px] w-full"
                      />
                    ) : (
                      <Input
                        value={String(candidates[rowIndex][col.key] ?? "")}
                        onChange={(e) => onEdit(rowIndex, col.key, e.target.value)}
                        type={col.key === "experience" ? "number" : "text"}
                      />
                    )
                  ) : (
                    <div className="whitespace-pre-wrap py-2">{String(candidate[col.key] ?? "")}</div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const renderMappingTable = () => (
    <div className="relative h-full w-full overflow-auto rounded-md border">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[280px] bg-muted/50">マスク文字列</TableHead>
            <TableHead className="min-w-[320px] bg-muted/50">元文字列</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappingRows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell className="align-top">{row.masked}</TableCell>
              <TableCell className="align-top">{row.original}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="w-full min-w-0 px-4 sm:px-6 pt-6 pb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">候補者データ</h1>
        <p className="text-muted-foreground">
          データを「オリジナル」「加工済み」「マスク対応表」で管理します。CSVをアップロードすると個人情報のマスキングが自動実行されます。
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={(v) => setTabInUrl(v as TabKey)} className="mt-4">
        <TabsList
          className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-muted/60 p-1 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur-md"
          aria-label="データ表示タブ"
        >
          <TabsTrigger
            value="original"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
          >
            オリジナル
          </TabsTrigger>
          <TabsTrigger
            value="processed"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
          >
            加工済み
          </TabsTrigger>
          <TabsTrigger
            value="mapping"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
          >
            マスク対応表
          </TabsTrigger>
        </TabsList>

        {/* オリジナル */}
        <TabsContent value="original" className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                CSVインポート
                <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </Button>
            {uploading && !isMaskingModalOpen && (
              <div className="space-y-2 w-full md:w-auto md:ml-2">
                <Label>CSVを処理中...</Label>
                <Progress value={progress} className="w-full md:w-[320px]" />
              </div>
            )}
          </div>

          <div className="mt-4 min-w-0 h-[calc(100vh-300px)]">{renderCandidateTable(candidates, false)}</div>
        </TabsContent>

        {/* 加工済み */}
        <TabsContent value="processed" className="mt-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Button onClick={handleExportProcessed} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              エクスポート
            </Button>

            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <Switch id="edit-processed" checked={isEditableProcessed} onCheckedChange={setIsEditableProcessed} />
                <Label htmlFor="edit-processed">編集モード</Label>
              </div>
              {isEditableProcessed && (
                <Button onClick={handleSaveProcessed}>
                  <Save className="mr-2 h-4 w-4" />
                  変更を保存
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 min-w-0 h-[calc(100vh-300px)]">
            {renderCandidateTable(
              isEditableProcessed ? candidates : maskedCandidates,
              isEditableProcessed,
              handleProcessedEdit,
            )}
          </div>
        </TabsContent>

        {/* マスク対応表 */}
        <TabsContent value="mapping" className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">「マスク文字列」と「元文字列」の対応表です。</div>
          <div className="min-w-0 h-[calc(100vh-300px)]">{renderMappingTable()}</div>
        </TabsContent>
      </Tabs>

      {/* 進捗モーダル（アニメーション無し・閉じるボタン無し） */}
      <Dialog open={isMaskingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>個人情報をマスキング中</DialogTitle>
            <DialogDescription>処理が完了するまでお待ちください...</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Progress value={maskingProgress} className="w-full" />
            <div className="text-sm text-muted-foreground text-center">
              {processedCount} / {totalCount} 件 処理済み
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
