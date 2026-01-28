import type { FeeStatus } from "@/utils/types"

export interface IFeeEntry {
  id: string
  month: string
  amount: string
  dueDate: string
  status: FeeStatus
}
