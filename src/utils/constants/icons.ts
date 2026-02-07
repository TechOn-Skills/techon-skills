import { ComponentType } from "react"
import {
  CodeIcon,
  DatabaseIcon,
  LayersIcon,
  LayoutDashboardIcon,
  NetworkIcon,
  SmartphoneIcon,
  StoreIcon,
  WrenchIcon,
} from "lucide-react"

export const Icons: Record<string, ComponentType<{ className?: string }>> = {
  code: CodeIcon,
  database: DatabaseIcon,
  layers: LayersIcon,
  layout: LayoutDashboardIcon,
  network: NetworkIcon,
  smartphone: SmartphoneIcon,
  store: StoreIcon,
  wrench: WrenchIcon,
}
