import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1c1e26",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
        }}
      >
        <svg width="130" height="130" viewBox="0 0 100 100" fill="none">
          <path
            d="M50 88 C50 88 10 62 10 36 C10 22 21 13 34 13 C41 13 47 17 50 23 C53 17 59 13 66 13 C79 13 90 22 90 36 C90 62 50 88 50 88Z"
            fill="#6fb7b0"
          />
          <path
            d="M50 80 C50 80 18 58 18 37 C18 27 26 20 36 20 C42 20 47 24 50 29 C53 24 58 20 64 20 C74 20 82 27 82 37 C82 58 50 80 50 80Z"
            fill="#4da8a0"
          />
          <circle cx="43" cy="52" r="8" fill="#edeef2" />
          <circle cx="55" cy="62" r="6" fill="#edeef2" />
          <path
            d="M37 58 Q36 68 45 70 Q54 72 58 66"
            stroke="#edeef2"
            stroke-width="4"
            stroke-linecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    size
  )
}
