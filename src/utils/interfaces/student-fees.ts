import type { FeeStatus } from "@/utils/types"

export interface IFeeEntry {
  id: string
  month: string
  amount: string
  dueDate: string
  status: FeeStatus
  /** True when the due date's month is <= current month (fee is due by the 12th rule). */
  dueMonthReached?: boolean
}
