import { describe, expect, it } from "vitest";

import { render, screen } from "@/tests/utils/render";
import type { Session } from "@/types/session";

import { SpeakerCard } from "./speaker-card";

function session(overrides: Partial<Session> = {}): Session {
  return {
    id: "a-session",
    title: "A session",
    speaker: "Amir Khan",
    track: "React",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 45,
    description: "",
    ...overrides,
  };
}

describe("SpeakerCard", () => {
  it("shows the speaker's name and each session's time and title", () => {
    render(
      <SpeakerCard
        speaker="Amir Khan"
        sessions={[
          session({ id: "s1", title: "First talk", startTime: "09:00" }),
          session({ id: "s2", title: "Second talk", startTime: "14:00" }),
        ]}
      />,
    );

    expect(screen.getByText("Amir Khan")).toBeInTheDocument();
    expect(screen.getByText("First talk")).toBeInTheDocument();
    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("Second talk")).toBeInTheDocument();
    expect(screen.getByText("14:00")).toBeInTheDocument();
  });

  it("links each session to its session page", () => {
    render(
      <SpeakerCard
        speaker="Amir Khan"
        sessions={[session({ id: "opening-keynote" })]}
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/en/sessions/opening-keynote",
    );
  });
});
