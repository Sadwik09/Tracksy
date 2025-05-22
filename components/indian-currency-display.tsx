import { formatIndianCurrency, formatLargeIndianAmount } from "@/lib/utils-indian-currency"

interface IndianCurrencyDisplayProps {
  amount: number
  useShortFormat?: boolean
  className?: string
}

export function IndianCurrencyDisplay({ amount, useShortFormat = false, className = "" }: IndianCurrencyDisplayProps) {
  return (
    <span className={className}>{useShortFormat ? formatLargeIndianAmount(amount) : formatIndianCurrency(amount)}</span>
  )
}
