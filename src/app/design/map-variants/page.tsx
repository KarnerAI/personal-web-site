// Preview route — compare map variants side-by-side.
// Not linked from production nav. Access at /design/map-variants.
// Leaflet is client-only; its dynamic(ssr:false) import lives in
// TravelMapLeafletClient so this page can stay a Server Component
// (Next.js 16 disallows ssr:false on dynamic() inside page files).

import { TravelMap } from "@/components/sections/beyondwork/TravelMap";
import { TravelMapAtlas } from "@/components/sections/beyondwork/map-variants/TravelMapAtlas";
import { TravelMapGeo } from "@/components/sections/beyondwork/map-variants/TravelMapGeo";
import { TravelMapJournal } from "@/components/sections/beyondwork/map-variants/TravelMapJournal";
import { TravelMapLeaflet } from "@/components/sections/beyondwork/map-variants/TravelMapLeafletClient";
import { TravelMapPlate } from "@/components/sections/beyondwork/map-variants/TravelMapPlate";
import { TravelMapTransit } from "@/components/sections/beyondwork/map-variants/TravelMapTransit";

type VariantMeta = {
  id: "current" | "A" | "B" | "C" | "D" | "E" | "F";
  label: string;
  name: string;
  description: string;
  Component: () => React.ReactElement;
};

const variants: VariantMeta[] = [
  {
    id: "F",
    label: "Variant F · NEW",
    name: "Real interactive map (Leaflet + CartoDB Voyager tiles)",
    description:
      "Actual pan/zoom map with real tiles — closest OSS match to the Google Maps reference. Navy header strip with avatar + share/fullscreen. Red teardrop pins; Colombia gets the larger 'selected' pin with popup.",
    Component: TravelMapLeaflet,
  },
  {
    id: "E",
    label: "Variant E",
    name: "Modern Cartography (Google Maps palette)",
    description:
      "Real cartographic colors: soft blue ocean, cream land, subtle green terrain. Red pins pop like Google Maps markers. Colombia gets a white-dotted 'selected' pin with a label pill.",
    Component: TravelMapGeo,
  },
  {
    id: "current",
    label: "Current",
    name: "Dot-matrix continents",
    description: "What's shipped today — abstract dot grid background.",
    Component: TravelMap,
  },
  {
    id: "A",
    label: "Variant A",
    name: "Cartographer's Atlas",
    description:
      "Light-gray country fills with thin slate borders. Vermillion pins, Colombia with navy halo. Ruled frame + compass rose.",
    Component: TravelMapAtlas,
  },
  {
    id: "B",
    label: "Variant B",
    name: "Transit-Map World",
    description:
      "Flat navy country silhouettes. Vermillion station dots connected by subway-style arcs. Colombia as the terminus.",
    Component: TravelMapTransit,
  },
  {
    id: "C",
    label: "Variant C",
    name: "Topographic Journal",
    description:
      "Warm paper background with stippled texture. Pushpin markers + soft shadows. Colombia with ribbon. Handwritten-style labels.",
    Component: TravelMapJournal,
  },
  {
    id: "D",
    label: "Variant D",
    name: "Mercator Plate",
    description:
      "Graticule grid, fine country borders, ruled frame with degree ticks. Colombia called out by a labeled leader line.",
    Component: TravelMapPlate,
  },
];

export default function MapVariantsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-12">
      <div className="mx-auto max-w-[1080px] px-6">
        <header className="mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-2">
            Design · Beyond Work
          </p>
          <h1 className="text-4xl font-semibold tracking-tight mb-2">
            Travel map — 4 directions.
          </h1>
          <p className="text-muted max-w-[620px]">
            Each variant uses the same Tokyo Transit palette and the same 16 visited
            countries. Scroll through and tell me which direction to take (or mix).
          </p>
        </header>

        <div className="space-y-16">
          {variants.map((v) => {
            const Component = v.Component;
            return (
              <section key={v.id}>
                <div className="mb-4 flex items-baseline gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                    {v.label}
                  </span>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {v.name}
                  </h2>
                </div>
                <p className="text-sm text-muted mb-4 max-w-[720px]">
                  {v.description}
                </p>
                <Component />
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
