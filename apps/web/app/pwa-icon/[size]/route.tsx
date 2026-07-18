import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

function PwaIcon({ size, maskable }: { size: number; maskable?: boolean }) {
  const r = maskable ? 0 : size * 0.25
  const pad = maskable ? size * 0.1 : 0
  const w = size - pad * 2

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#1c1e26",
        borderRadius: r,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={w} height={w} viewBox="0 0 100 100" fill="none">
        {/* Outer heart */}
        <path
          d="M50 88 C50 88 10 62 10 36 C10 22 21 13 34 13 C41 13 47 17 50 23 C53 17 59 13 66 13 C79 13 90 22 90 36 C90 62 50 88 50 88Z"
          fill="#6fb7b0"
        />
        {/* Inner heart */}
        <path
          d="M50 80 C50 80 18 58 18 37 C18 27 26 20 36 20 C42 20 47 24 50 29 C53 24 58 20 64 20 C74 20 82 27 82 37 C82 58 50 80 50 80Z"
          fill="#4da8a0"
        />
        {/* Mother silhouette — head */}
        <circle cx="43" cy="52" r="8" fill="#edeef2" />
        {/* Baby */}
        <circle cx="55" cy="62" r="6" fill="#edeef2" />
        {/* Arms / embrace curve */}
        <path
          d="M37 58 Q36 68 45 70 Q54 72 58 66"
          stroke="#edeef2"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeParam } = await params
  const maskable = sizeParam === "maskable"
  const px = maskable ? 512 : parseInt(sizeParam, 10)

  if (!maskable && (px !== 192 && px !== 512)) {
    return new Response("Not found", { status: 404 })
  }

  return new ImageResponse(<PwaIcon size={px} maskable={maskable} />, {
    width: px,
    height: px,
  })
}
