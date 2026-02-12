import type { TechId } from "@/utils/types"

/** Map technology label (from schema) to TechId for TechLogoCard. */
const LABEL_TO_TECH_ID: Record<string, TechId> = {
  react: "react",
  "react native": "react-native",
  "react-native": "react-native",
  "node.js": "node",
  node: "node",
  express: "express",
  mongodb: "mongodb",
  postgresql: "postgres",
  postgres: "postgres",
  graphql: "graphql",
  python: "python",
  fastapi: "fastapi",
  "next.js": "nextjs",
  nextjs: "nextjs",
  shopify: "shopify",
  liquid: "liquid",
  wordpress: "wordpress",
  woocommerce: "woocommerce",
  elementor: "elementor",
  wix: "wix",
  velo: "velo",
}

function normalizeLabel(label: string): string {
  return label.toLowerCase().trim().replace(/\s+/g, " ")
}

export function techIdFromLabel(label: string): TechId {
  const key = normalizeLabel(label)
  const withHyphens = key.replace(/\s+/g, "-")
  return LABEL_TO_TECH_ID[key] ?? LABEL_TO_TECH_ID[withHyphens] ?? "react"
}
