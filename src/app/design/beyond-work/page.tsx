// Preview route — renders the production BeyondWork section in isolation.
// Useful while the homepage `/` has unrelated compile errors on the branch.

import { BeyondWork } from "@/components/sections/BeyondWork";

export default function BeyondWorkPreviewPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <BeyondWork />
    </main>
  );
}
