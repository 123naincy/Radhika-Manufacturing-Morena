import { ImageResponse } from "next/og";

export const alt = "Radhika Copy House — wholesale stationery manufacturer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#101b2d",
          color: "white",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 4,
            color: "#f3c1c4",
          }}
        >
          MANUFACTURER · WHOLESALER
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            marginTop: 18,
          }}
        >
          Radhika Copy House
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 18,
            color: "#d7dde8",
          }}
        >
          Notebooks, copies, registers and office stationery in bulk.
        </div>
      </div>
    ),
    { ...size }
  );
}
