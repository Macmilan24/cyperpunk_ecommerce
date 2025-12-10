export function NoiseOverlay() {
  return (
    <>
      <div className="noise-bg fixed inset-0 z-50 pointer-events-none mix-blend-overlay"></div>
      <div className="scanlines fixed inset-0 z-50 pointer-events-none opacity-20"></div>
    </>
  );
}
