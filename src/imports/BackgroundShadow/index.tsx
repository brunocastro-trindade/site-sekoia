import svgPaths from "./svg-gyy55ypk6l";

export default function BackgroundShadow() {
  return (
    <div className="relative size-full" data-name="Background+Shadow">
      <div className="absolute inset-[-9.09%_-3.02%_-22.73%_-3.02%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1230 290">
          <g filter="url(#filter0_d_1_318)" id="Background+Shadow">
            <path d={svgPaths.p213dbe00} fill="var(--fill-0, #39471D)" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="290" id="filter0_d_1_318" width="1230" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="15" />
              <feGaussianBlur stdDeviation="17.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.19 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_318" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_318" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}