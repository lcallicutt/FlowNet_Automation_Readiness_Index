import type { AssessmentResult } from "./assessment";
import type { AuditResult } from "./audit";

/**
 * Lightweight localStorage persistence layer.
 * Swap these functions for Supabase queries when user accounts are added.
 */

const ASSESSMENTS_KEY = "flownet.assessments";
const AUDITS_KEY = "flownet.audits";
const USER_KEY = "flownet.user";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // storage full or unavailable — non-fatal for the MVP
  }
}

export function saveAssessment(result: AssessmentResult) {
  const all = read<AssessmentResult>(ASSESSMENTS_KEY);
  all.unshift(result);
  write(ASSESSMENTS_KEY, all.slice(0, 20));
}

export function getAssessments(): AssessmentResult[] {
  return read<AssessmentResult>(ASSESSMENTS_KEY);
}

export function getLatestAssessment(): AssessmentResult | null {
  return getAssessments()[0] ?? null;
}

export function saveAudit(result: AuditResult) {
  const all = read<AuditResult>(AUDITS_KEY);
  all.unshift(result);
  write(AUDITS_KEY, all.slice(0, 20));
}

export function getAudits(): AuditResult[] {
  return read<AuditResult>(AUDITS_KEY);
}

export function getLatestAudit(): AuditResult | null {
  return getAudits()[0] ?? null;
}

export interface StoredUser {
  email: string;
  name?: string;
}

export function saveUser(user: StoredUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}
