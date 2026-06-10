export default function CoverPreview() {
  return (
    <div className="min-h-screen bg-white px-10 py-6 overflow-auto">
      <h1
        style={{ fontFamily: "var(--font-adamina)" }}
        className="text-[64px] leading-none mb-10"
      >
        Cover generator
      </h1>

      <div className="flex justify-center">
        <svg viewBox="0 0 900 600" className="w-full max-w-225">
          {/* Cover area */}
          <rect
            x="120"
            y="120"
            width="600"
            height="320"
            fill="white"
            stroke="black"
            strokeWidth="1"
          />

          {/* Back */}
          <rect
            x="150"
            y="150"
            width="260"
            height="260"
            fill="white"
            stroke="black"
            strokeDasharray="5 5"
          />

          {/* Spine */}
          <rect
            x="410"
            y="150"
            width="30"
            height="260"
            fill="#f1f1f1"
            stroke="black"
          />

          {/* Front */}
          <rect
            x="440"
            y="150"
            width="260"
            height="260"
            fill="white"
            stroke="black"
            strokeDasharray="5 5"
          />

          {/* Labels */}
          <text
            x="280"
            y="285"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
          >
            BACK
          </text>

          <text
            x="570"
            y="285"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
          >
            FRONT
          </text>

          <text
            x="425"
            y="285"
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            transform="rotate(-90 425 285)"
          >
            SPINE
          </text>

          {/* Top dimension */}
          <line x1="120" y1="90" x2="720" y2="90" stroke="black" />
          <line x1="120" y1="90" x2="120" y2="110" stroke="black" />
          <line x1="720" y1="90" x2="720" y2="110" stroke="black" />

          <text x="420" y="80" textAnchor="middle" fontSize="14">
            347.0
          </text>

          {/* Left dimension */}
          <line x1="90" y1="120" x2="90" y2="440" stroke="black" />
          <line x1="90" y1="120" x2="110" y2="120" stroke="black" />
          <line x1="90" y1="440" x2="110" y2="440" stroke="black" />

          <text x="70" y="285" textAnchor="middle" fontSize="14">
            245
          </text>

          {/* Bleed */}
          <text x="420" y="135" textAnchor="middle" fontSize="12">
            BLEED
          </text>

          <text x="420" y="430" textAnchor="middle" fontSize="12">
            BLEED
          </text>
        </svg>
      </div>

      <div className="mt-10 max-w-175 text-[14px]">
        <div className="grid grid-cols-2 gap-y-4">
          <span>Net format (after trimming)</span>
          <strong>337 × 235 mm</strong>

          <span>Spine thickness</span>
          <strong>7 mm</strong>

          <span>Gross format (with bleed allowance)</span>
          <strong>347 × 245 mm</strong>

          <span>Book block thickness</span>
          <strong>6.83 mm</strong>
        </div>
      </div>
    </div>
  );
}
