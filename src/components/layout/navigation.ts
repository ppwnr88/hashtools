import { Binary, Fingerprint, Hash, KeyRound, LockKeyhole, Rss, ShieldCheck, TerminalSquare } from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  label: string;
  to: string;
  icon: ComponentType<{ size?: number }>;
};

export const navItems: NavItem[] = [
  { label: "Common Hash", to: "/tools/hash", icon: Hash },
  { label: "SHA Family", to: "/tools/hash?group=sha", icon: ShieldCheck },
  { label: "SHA3 / Keccak", to: "/tools/hash?group=sha3", icon: TerminalSquare },
  { label: "Checksum", to: "/tools/hash?group=checksum", icon: Fingerprint },
  { label: "HMAC", to: "/tools/hmac", icon: KeyRound },
  { label: "Password Hash", to: "/tools/password-hash", icon: LockKeyhole },
  { label: "Encode / Decode", to: "/tools/encode-decode", icon: Binary },
  { label: "Hash Identifier", to: "/tools/hash-identifier", icon: Rss },
];
