/**
 * Format a number to Indian currency format (with lakhs and crores)
 * @param amount The amount to format
 * @returns Formatted string with ₹ symbol
 */
export function formatIndianCurrency(amount: number): string {
  // Convert to Indian number format (with commas at thousands, lakhs, crores)
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(amount)
}

/**
 * Format a large number to Indian format with appropriate suffix (K, L, Cr)
 * @param amount The amount to format
 * @returns Formatted string with appropriate suffix
 */
export function formatLargeIndianAmount(amount: number): string {
  if (amount >= 10000000) {
    // 1 crore = 10,000,000
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    // 1 lakh = 100,000
    return `₹${(amount / 100000).toFixed(2)} L`
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)}K`
  } else {
    return `₹${amount.toFixed(2)}`
  }
}
