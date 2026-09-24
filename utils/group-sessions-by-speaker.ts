import type { Session } from "@/types/session";
import { timeToMinutes } from "@/utils/schedule-time";

/**
 * The seed data uses this literal `speaker` value for the closing panel — a
 * multi-speaker Q&A, not an individual person — so it's excluded from the
 * per-speaker grouping below rather than rendered as its own "speaker".
 */
const NON_SPEAKER_LABELS = ["Full speaker lineup"];

export interface SpeakerSessions {
  speaker: string;
  sessions: Session[];
}

/**
 * Groups sessions by speaker. Speakers are sorted by name, and each
 * speaker's own sessions are sorted chronologically by start time.
 */
export function groupSessionsBySpeaker(sessions: Session[]): SpeakerSessions[] {
  const bySpeaker = new Map<string, Session[]>();

  for (const session of sessions) {
    if (NON_SPEAKER_LABELS.includes(session.speaker)) continue;

    const existing = bySpeaker.get(session.speaker);
    if (existing) {
      existing.push(session);
    } else {
      bySpeaker.set(session.speaker, [session]);
    }
  }

  return Array.from(bySpeaker, ([speaker, speakerSessions]) => ({
    speaker,
    sessions: [...speakerSessions].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
    ),
  })).sort((a, b) => a.speaker.localeCompare(b.speaker));
}
