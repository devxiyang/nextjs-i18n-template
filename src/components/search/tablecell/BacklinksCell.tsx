"use client";

import { AvgBacklinksInfo } from "@/lib/types.thirdapi";
import { formatNumber } from "@/lib/utils";

interface BacklinksCellProps {
  backlinksInfo?: AvgBacklinksInfo;
}

export default function BacklinksCell({ backlinksInfo }: BacklinksCellProps) {
  if (!backlinksInfo) {
    return <span className="text-gray-400 dark:text-gray-500">-</span>;
  }

  return (
    <div className="space-y-1">
      {/* 主要显示反向链接数和引用域名数 */}
      <div className="font-medium">{formatNumber(backlinksInfo.backlinks)}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {formatNumber(backlinksInfo.referring_domains)} 域名
      </div>
    </div>
  );
} 