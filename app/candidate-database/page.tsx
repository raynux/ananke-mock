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
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Save, Download, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type Candidate = Record<string, string | number>
type TabKey = "original" | "processed" | "mapping"

// ご指定のカラム一覧（キーと表示名を同一にしています）
const columns: string[] = [
  "正式部名称",
  "正式室課名称",
  "正式係Ｇ名称",
  "氏名",
  "資格職位名称",
  "従業員性別",
  "入社形態(新卒/キャリア/キャリアカムバック)",
  "年齢('26/1時点)",
  "年次",
  "学歴",
  "現在休職者フラグ",
  "ロケーション名称",
  "最新社内英検級",
  "入社年月日",
  "一選or二選等(幹部職・基幹職・主任職で現資格の情報)",
  "現部在籍年数('26/1)",
  "キャリア入社の場合の前職会社名",
  "修行派遣先事業体",
  "修行派遣開始日",
  "修行派遣終了日",
  "修行派遣期間",
  "時短適用有無",
  "住所",
  "メンター活動",
  "組合歴",
  "随行秘書経験有無",
  "随行秘書経験期間",
  "家族情報",
  "＜職能＞N年度",
  "＜職能＞N-1年度",
  "＜職能＞N-2年度",
  "＜期間考課＞N-1年度冬",
  "＜期間考課＞N-1年度夏",
  "＜期間考課＞N-2年度冬",
  "＜期間考課＞N-2年度夏",
  "＜異動希望＞【本人】当面の方向性",
  "＜異動希望＞異動時期名称＿本人",
  "＜異動希望＞【本人】第１希望：部門名称",
  "＜異動希望＞【本人】第１希望：部名称",
  "＜異動希望＞【本人】第１希望：室課名称",
  "＜異動希望＞【本人】第２希望：部門名称",
  "＜異動希望＞【本人】第２希望：部名称",
  "＜異動希望＞【本人】第２希望：室課名称",
  "＜異動希望＞【本人】第３希望：部門名称",
  "＜異動希望＞【本人】第３希望：部名称",
  "＜異動希望＞【本人】第３希望：室課名称",
  "【上司】異動・帰任推薦先",
  "＜異動希望＞【上司】推薦先（その他）",
  "＜異動希望＞【上司】異動・帰任時期",
  "＜異動希望＞【上司】時期（それ以降）",
  "＜異動希望＞【上司】第１希望：部門名称",
  "＜異動希望＞【上司】第１希望：部名称",
  "＜異動希望＞【上司】第１希望：室課名称",
  "＜異動希望＞【上司】第２希望：部門名称",
  "＜異動希望＞【上司】第２希望：部名称",
  "＜異動希望＞【上司】第２希望：室課名称",
  "＜異動希望＞【上司】第３希望：部門名称",
  "＜異動希望＞【上司】第３希望：部名称",
  "＜異動希望＞【上司】第３希望：室課名称",
  "【本人】海外勤務希望　※事技職のみ",
  "＜異動希望＞【上司】海外勤務希望　※事技職のみ",
  "＜本人申告＞需給スキル",
  "＜本人申告＞価格・収益スキル",
  "＜本人申告＞事業企画スキル",
  "＜本人申告＞商品スキル",
  "＜本人申告＞販促・ブランド・広報スキル",
  "＜本人申告＞国担当スキル",
  "＜本人申告＞総括・人事スキル",
  "＜本人申告＞VCスキル",
  "＜本人申告＞補給部品スキル",
  "＜本人申告＞TPSスキル",
  "＜本人申告＞国内営業スキル",
  "＜本人申告＞その他スキル",
  "＜面談者申告＞需給スキル",
  "＜面談者申告＞価格・収益スキル",
  "＜面談者申告＞事業企画スキル",
  "＜面談者申告＞商品スキル",
  "＜面談者申告＞販促・ブランド・広報スキル",
  "＜面談者申告＞国担当スキル",
  "＜面談者申告＞総括・人事スキル",
  "＜面談者申告＞VCスキル",
  "＜面談者申告＞補給部品スキル",
  "＜面談者申告＞TPSスキル",
  "＜面談者申告＞国内営業スキル",
  "＜面談者申告＞その他スキル",
]

// カラム設定（全列横スクロール対応）
const columnConfig: { key: string; name: string; isMultiLine?: boolean }[] = columns.map((name) => {
  const multi = name.includes("スキル") || name.includes("情報") || name.includes("希望")
  return { key: name, name, isMultiLine: multi }
})

// 初期データ（ダミー）
function makeCandidateBase(overrides: Partial<Candidate> = {}): Candidate {
  const base: Candidate = {}
  for (const c of columns) base[c] = ""
  return { ...base, ...overrides }
}

const initialCandidates: Candidate[] = [
  makeCandidateBase({
    正式部名称: "技術本部",
    正式室課名称: "開発一課",
    正式係Ｇ名称: "フロントエンドG",
    氏名: "田中 太郎",
    従業員性別: "男",
    "入社形態(新卒/キャリア/キャリアカムバック)": "キャリア",
    "年齢('26/1時点)": "32",
    学歴: "東京大学 工学部 卒",
    ロケーション名称: "東京",
    入社年月日: "2019-04-01",
    住所: "東京都千代田区...",
    家族情報: "既婚・子1",
    "＜本人申告＞需給スキル": "在庫計画, 調達",
    "＜面談者申告＞商品スキル": "企画〜改善",
  }),
  makeCandidateBase({
    正式部名称: "製品本部",
    正式室課名称: "企画二課",
    正式係Ｇ名称: "プロダクトG",
    氏名: "鈴木 花子",
    従業員性別: "女",
    "入社形態(新卒/キャリア/キャリアカムバック)": "新卒",
    "年齢('26/1時点)": "29",
    学歴: "慶應義塾大学 経済学部 卒",
    ロケーション名称: "名古屋",
    入社年月日: "2020-04-01",
    住所: "愛知県名古屋市...",
    家族情報: "未婚",
    "＜本人申告＞国内営業スキル": "大手量販対応",
    "＜面談者申告＞総括・人事スキル": "採用補助",
  }),
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

  // カラム選択モーダル
  const [isColumnSelectModalOpen, setIsColumnSelectModalOpen] = useState(false)
  const [pendingCandidates, setPendingCandidates] = useState<Candidate[]>([])
  const [selectedMaskColumns, setSelectedMaskColumns] = useState<string[]>(["氏名"])

  // URLのtabを書き換えるユーティリティ
  const setTabInUrl = (tab: TabKey) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.push(`${pathname}?${params.toString()}`)
  }

  // 行番号からハンドルを生成
  const handleForRow = (rowIndex: number, columnName: string) => {
    const columnIndex = selectedMaskColumns.indexOf(columnName)
    return `@user-${rowIndex + 1}-${columnIndex + 1}`
  }

  // 加工済み（選択されたカラムをマスク）
  const maskedCandidates = useMemo(() => {
    return candidates.map((c, i) => {
      const masked = { ...c }
      selectedMaskColumns.forEach((col) => {
        masked[col] = handleForRow(i, col)
      })
      return masked
    })
  }, [candidates, selectedMaskColumns])

  // マスク対応表（選択されたカラムのみ）
  const mappingRows = useMemo(() => {
    return candidates.flatMap((c, i) =>
      selectedMaskColumns.map((col) => ({
        masked: handleForRow(i, col),
        original: String(c[col] ?? ""),
        column: col,
      })),
    )
  }, [candidates, selectedMaskColumns])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    // ダミーCSV（新カラムに合わせたヘッダーと2行のデータ）
    const header = columns.join(",")
    const row1 = columns
      .map((col) => {
        switch (col) {
          case "氏名":
            return "新規 典子"
          case "正式部名称":
            return "営業本部"
          case "正式室課名称":
            return "首都圏営業課"
          case "従業員性別":
            return "女"
          case "入社形態(新卒/キャリア/キャリアカムバック)":
            return "キャリア"
          case "年齢('26/1時点)":
            return "27"
          case "ロケーション名称":
            return "東京"
          case "入社年月日":
            return "2022-10-01"
          case "住所":
            return "東京都品川区..."
          default:
            return ""
        }
      })
      .join(",")
    const row2 = columns
      .map((col) => {
        switch (col) {
          case "氏名":
            return "追加 祐介"
          case "正式部名称":
            return "マーケ本部"
          case "正式室課名称":
            return "デジタル課"
          case "従業員性別":
            return "男"
          case "入社形態(新卒/キャリア/キャリアカムバック)":
            return "新卒"
          case "年齢('26/1時点)":
            return "31"
          case "ロケーション名称":
            return "名古屋"
          case "入社年月日":
            return "2018-04-01"
          case "住所":
            return "愛知県名古屋市..."
          default:
            return ""
        }
      })
      .join(",")

    const dummyCsvText = `${header}\n${row1}\n${row2}\n`

    const lines = dummyCsvText
      .split("\n")
      .slice(1)
      .filter((line) => line.trim() !== "")

    const headers = dummyCsvText.split("\n")[0].split(",")
    const parsed: Candidate[] = []

    lines.forEach((line, index) => {
      const values = line.split(",")
      const candidate = headers.reduce((obj, header, i) => {
        const key = header.trim()
        const value = values[i] ?? ""
        obj[key] = String(value).replace(/"/g, "")
        return obj
      }, {} as Candidate)

      // 空行はスキップ（氏名が空の時）
      if (candidate["氏名"]) parsed.push(candidate)
      setProgress(Math.round(((index + 1) / lines.length) * 100))
    })

    const total = parsed.length
    if (total === 0) {
      setUploading(false)
      return
    }

    // CSVアップロード完了後、カラム選択モーダルを表示
    setProgress(100)
    setUploading(false)
    setPendingCandidates(parsed)
    setIsColumnSelectModalOpen(true)
  }

  const handleStartMasking = () => {
    setIsColumnSelectModalOpen(false)

    const total = pendingCandidates.length
    if (total === 0) return

    // マスキング進捗モーダル開始
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
      setCandidates((prev) => [...prev, ...pendingCandidates])
      setMaskingProgress(100)
      setProcessedCount(total)
      setTimeout(() => {
        setIsMaskingModalOpen(false)
        setPendingCandidates([])
        setTabInUrl("processed") // 加工済みタブへ
      }, 400)
    }, 3600)
  }

  const handleProcessedEdit = (row: number, field: string, value: string | number) => {
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
          let value = String(candidate[col.key] ?? "")
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
    onEdit?: (row: number, field: string, value: string | number) => void,
  ) => (
    <div className="relative h-full w-full overflow-auto rounded-md border">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            {columnConfig.map((col) => (
              <TableHead key={col.key} className="min-w-[220px] bg-muted/50">
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
                        type="text"
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
            <TableHead className="min-w-[200px] bg-muted/50">カラム名</TableHead>
            <TableHead className="min-w-[280px] bg-muted/50">マスク文字列</TableHead>
            <TableHead className="min-w-[320px] bg-muted/50">元文字列</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappingRows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell className="align-top">{row.column}</TableCell>
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
            {uploading && (
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

      {/* カラム選択モーダル */}
      <Dialog open={isColumnSelectModalOpen} onOpenChange={setIsColumnSelectModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              マスクするカラムを選択
            </DialogTitle>
            <DialogDescription>
              個人情報や機密情報を含むカラムを選択してください。選択されたカラムは@user-形式でマスクされます。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {columns.map((column) => (
                <div key={column} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mask-${column}`}
                    checked={selectedMaskColumns.includes(column)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMaskColumns((prev) => [...prev, column])
                      } else {
                        setSelectedMaskColumns((prev) => prev.filter((col) => col !== column))
                      }
                    }}
                  />
                  <Label htmlFor={`mask-${column}`} className="text-sm cursor-pointer">
                    {column}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">{selectedMaskColumns.length} カラムが選択されています</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsColumnSelectModalOpen(false)
                  setPendingCandidates([])
                }}
              >
                キャンセル
              </Button>
              <Button onClick={handleStartMasking} disabled={selectedMaskColumns.length === 0}>
                <Shield className="mr-2 h-4 w-4" />
                マスキング開始
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
