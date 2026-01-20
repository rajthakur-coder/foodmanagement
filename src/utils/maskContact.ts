// src/utils/maskContact.ts
export type MaskOptions = {
  showLast?: number;      // how many trailing chars to show (default 4 for phone)
  emailKeepEdges?: number; // keep how many chars at start/end of local part (default 1 each)
  separator?: string;     // separator to insert between country code and masked part (default '-')
};

const defaultOptions: MaskOptions = {
  showLast: 4,
  emailKeepEdges: 1,
  separator: "-",
};

const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s);

const maskEmail = (email: string, opts: MaskOptions): string => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  const keep = Math.max(0, opts.emailKeepEdges ?? defaultOptions.emailKeepEdges!);
  if (local.length <= keep * 2 + 1) {
    // too short to mask much, just replace middle with x if possible
    const left = local.slice(0, keep);
    const right = local.slice(local.length - keep);
    const midLen = Math.max(0, local.length - left.length - right.length);
    const mid = "x".repeat(midLen);
    return `${left}${mid}${right}@${domain}`;
  }

  const left = local.slice(0, keep);
  const right = local.slice(local.length - keep);
  const mid = "x".repeat(Math.max(1, local.length - left.length - right.length));
  return `${left}${mid}${right}@${domain}`;
};

const maskPhone = (phone: string, opts: MaskOptions): string => {
  const showLast = opts.showLast ?? defaultOptions.showLast!;
  const separator = opts.separator ?? defaultOptions.separator!;
  // Keep plus and country code if present: e.g. +91...
  const plusMatch = phone.match(/^(\+[\d]{1,4})(.*)$/);
  let country = "";
  let rest = phone;

  if (plusMatch) {
    country = plusMatch[1]; // +91
    rest = plusMatch[2].replace(/\D/g, ""); // remove any non-digits from rest
  } else {
    // also handle numbers with spaces/dashes: strip non-digits
    rest = phone.replace(/\D/g, "");
  }

  if (rest.length <= showLast) {
    // too short: just mask everything except shown last
    const visible = rest.slice(-showLast);
    const masked = "x".repeat(Math.max(0, rest.length - visible.length));
    return country ? `${country}${separator}${masked}${visible}` : `${masked}${visible}`;
  }

  const visible = rest.slice(-showLast);
  const maskedLen = rest.length - showLast;
  const masked = "x".repeat(maskedLen);
  return country ? `${country}${separator}${masked}${visible}` : `${masked}${visible}`;
};

/**
 * maskContact - auto-detects email vs phone and masks it.
 * Usage: maskContact("john.doe@gmail.com") => "jxxxxxe@gmail.com"
 *        maskContact("+911234567890") => "+91-xxxx7890"
 */
export function maskContact(input: string, opts?: Partial<MaskOptions>): string {
  if (!input || typeof input !== "string") return input;
  const options = { ...defaultOptions, ...(opts ?? {}) };

  if (isEmail(input)) return maskEmail(input.trim(), options);
  return maskPhone(input.trim(), options);
}

export default maskContact;
