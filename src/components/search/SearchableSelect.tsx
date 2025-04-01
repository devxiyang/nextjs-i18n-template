"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ChevronDown, Check, Search } from "lucide-react"

// 项目类型定义
export type SelectItem = {
  value: string
  label: string
}

// 主组件 - 极简版本
interface SearchableSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  notFoundText?: string
  disabled?: boolean
  items: SelectItem[]
  className?: string
}

export function SearchableSelect({
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  notFoundText = "No results found",
  disabled = false,
  items = [],
  className,
}: SearchableSelectProps) {
  // 状态
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  // 当下拉菜单打开时自动聚焦搜索框
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10)
    } else {
      setSearchTerm("")
    }
  }, [open])
  
  // 点击外部关闭
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node) && open) {
        setOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])
  
  // 过滤选项
  const filteredItems = React.useMemo(() => {
    if (!searchTerm) return items
    
    return items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [items, searchTerm])
  
  // 找到当前选中项
  const selectedItem = items.find(item => item.value === value)
  
  // 处理项目选择
  const handleSelect = (item: SelectItem) => {
    onValueChange?.(item.value)
    setOpen(false)
  }
  
  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* 触发按钮 */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:border-input"
        )}
        disabled={disabled}
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {selectedItem?.label || placeholder}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          open && "rotate-180"
        )} />
      </button>
      
      {/* 下拉内容 */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 dark:border-slate-700 dark:bg-slate-900">
          {/* 搜索输入 */}
          <div className="p-2 border-b border-border dark:border-slate-700">
            <div className="flex items-center px-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-full border-0 bg-transparent p-0 shadow-none outline-none focus-visible:ring-0"
                autoComplete="off"
              />
            </div>
          </div>
          
          {/* 选项列表 */}
          <div className="max-h-[220px] overflow-y-auto p-1">
            {searchTerm && filteredItems.length === 0 ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                {notFoundText}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={cn(
                      "relative w-full flex items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer dark:hover:bg-slate-800",
                      item.value === value && "bg-accent text-accent-foreground dark:bg-slate-700"
                    )}
                    onClick={() => handleSelect(item)}
                    role="option"
                    aria-selected={item.value === value}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {item.value === value && <Check className="h-4 w-4" />}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
