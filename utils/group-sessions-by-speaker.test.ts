import { describe, expect, it } from "vitest";

import type { Session } from "@/types/session";

import { groupSessionsBySpeaker } from "./group-sessions-by-speaker";

function session(overrides: Partial<Session> = {}): Session {
  return {
    id: "a-session",
    title: "A session",
    speaker: "A speaker",
    track: "React",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 45,
    description: "",
    ...overrides,
  };
}

describe("groupSessionsBySpeaker", () => {
  it("groups sessions by speaker, sorted by speaker name", () => {
    const groups = groupSessionsBySpeaker([
      session({ id: "b1", speaker: "Zoe Adams", startTime: "09:00" }),
      session({ id: "a1", speaker: "Amir Khan", startTime: "10:00" }),
    ]);

    expect(groups.map((group) => group.speaker)).toEqual([
      "Amir Khan",
      "Zoe Adams",
    ]);
  });

  it("sorts a speaker's own sessions chronologically", () => {
    const groups = groupSessionsBySpeaker([
      session({ id: "afternoon", speaker: "Amir Khan", startTime: "14:00" }),
      session({ id: "morning", speaker: "Amir Khan", startTime: "09:00" }),
    ]);

    expect(groups[0].sessions.map((s) => s.id)).toEqual([
      "morning",
      "afternoon",
    ]);
  });

  it("excludes the closing panel's placeholder speaker", () => {
    const groups = groupSessionsBySpeaker([
      session({ id: "closing-panel", speaker: "Full speaker lineup" }),
      session({ id: "keynote", speaker: "Amir Khan" }),
    ]);

    expect(groups).toEqual([expect.objectContaining({ speaker: "Amir Khan" })]);
  });

  it("returns nothing for no sessions", () => {
    expect(groupSessionsBySpeaker([])).toEqual([]);
  });
});
