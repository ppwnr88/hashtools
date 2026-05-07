import { Binary, Hash, KeyRound, LockKeyhole, Rss } from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  label: string;
  to: string;
  icon: ComponentType<{ size?: number }>;
};

export const navItems: NavItem[] = [
  { label: "Hash / Checksum", to: "/tools/hash", icon: Hash },
  { label: "HMAC", to: "/tools/hmac", icon: KeyRound },
  { label: "Password Hash", to: "/tools/password-hash", icon: LockKeyhole },
  { label: "Encode / Decode", to: "/tools/encode-decode", icon: Binary },
  { label: "Hash Identifier", to: "/tools/hash-identifier", icon: Rss },
];
