import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { EditModeProvider, useEditMode } from "./EditModeContext";

const STORAGE_KEY = "hussain-portfolio-edits-v1";

function Probe() {
  const { hydrated, overrides, setOverride } = useEditMode();
  return (
    <>
      <output>{hydrated ? JSON.stringify(overrides) : "loading"}</output>
      <button type="button" onClick={() => setOverride("hero", { positionY: 25 })}>
        Move hero
      </button>
    </>
  );
}

const renderProbe = () =>
  render(
    <EditModeProvider>
      <Probe />
    </EditModeProvider>
  );

describe("EditModeProvider", () => {
  afterEach(() => localStorage.clear());

  it("loads saved overrides once running in the browser", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ hero: { positionX: 40 } }));
    renderProbe();
    expect(screen.getByRole("status").textContent).toBe('{"hero":{"positionX":40}}');
  });

  it.each(["null", "[]", "42"])("treats stored %s as no saved edits", (stored) => {
    localStorage.setItem(STORAGE_KEY, stored);
    renderProbe();
    expect(screen.getByRole("status").textContent).toBe("{}");
  });

  it("ignores corrupt storage and saves new overrides", async () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    renderProbe();
    expect(screen.getByRole("status").textContent).toBe("{}");

    await userEvent.setup().click(screen.getByRole("button", { name: "Move hero" }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({ hero: { positionY: 25 } });
  });
});
