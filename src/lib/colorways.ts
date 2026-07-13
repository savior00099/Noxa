export interface ColorwayConfig {
  id: string;
  name: string;
  label: string;
  description: string;
  image: string;
  bgGradient: string;
  glowColor: string;
  glowColor2: string;
  accent: string;
  accentDark: string;
  stroke: string;
  particle1: string;
  particle2: string;
  shadowAccent: string;
  swatch: string;
}

export const COLORWAYS: ColorwayConfig[] = [
  {
    id: "umber",
    name: "Sepia Umber",
    label: "Sepia Umber",
    description:
      "Warm, worn-leather brown with a cream top plate — the classic viewfinder look, built to age like a good camera bag.",
    image: "/products/umber-float.jpg",
    bgGradient:
      "linear-gradient(135deg, #2E1C07 0%, #55370B 35%, #91590F 65%, #1C1104 100%)",
    glowColor: "rgba(179,124,29,0.55)",
    glowColor2: "rgba(145,89,15,0.40)",
    accent: "#B37C1D",
    accentDark: "#21140A",
    stroke: "#B37C1D",
    particle1: "#B37C1D",
    particle2: "#E0E3DE",
    shadowAccent: "rgba(179,124,29,0.45)",
    swatch: "#91590F",
  },
  {
    id: "olive",
    name: "Fern Olive",
    label: "Fern Olive",
    description:
      "Deep field-jacket green with a textured canvas grain — the quiet, everyday-carry finish for long days on the move.",
    image: "/products/olive-float.jpg",
    bgGradient:
      "linear-gradient(135deg, #16220D 0%, #253817 35%, #415C2B 65%, #0F1709 100%)",
    glowColor: "rgba(65,92,43,0.60)",
    glowColor2: "rgba(37,56,23,0.40)",
    accent: "#B37C1D",
    accentDark: "#14200C",
    stroke: "#E0E3DE",
    particle1: "#E0E3DE",
    particle2: "#B37C1D",
    shadowAccent: "rgba(65,92,43,0.45)",
    swatch: "#415C2B",
  },
  {
    id: "cream",
    name: "Bone Cream",
    label: "Bone Cream",
    description:
      "An all-light finish that keeps the digital readout front and center — clean, minimal, and easy to spot in any bag.",
    image: "/products/cream-float.jpg",
    bgGradient:
      "linear-gradient(135deg, #2A2620 0%, #423C30 35%, #6B6350 65%, #1A1712 100%)",
    glowColor: "rgba(224,227,222,0.45)",
    glowColor2: "rgba(179,124,29,0.30)",
    accent: "#E0E3DE",
    accentDark: "#26200F",
    stroke: "#E0E3DE",
    particle1: "#E0E3DE",
    particle2: "#B37C1D",
    shadowAccent: "rgba(224,227,222,0.35)",
    swatch: "#E0E3DE",
  },
];

export interface PackOption {
  label: string;
  detail: string;
  price: number;
  originalPrice: number;
}

// Prices in Bangladeshi Taka (৳).
export const CURRENCY = "৳";

export const PACKS: PackOption[] = [
  { label: "Standard", detail: "Buds + case + USB-C cable", price: 449, originalPrice: 799 },
  { label: "+ Charging Dock", detail: "Adds the desk charging stand", price: 599, originalPrice: 999 },
  { label: "Gift Bundle", detail: "Adds tips kit + travel pouch", price: 799, originalPrice: 1299 },
];

export function discountPercent(pack: PackOption): number {
  return Math.round(((pack.originalPrice - pack.price) / pack.originalPrice) * 100);
}

export function formatPrice(value: number): string {
  return `${CURRENCY}${Math.round(value).toLocaleString("en-BD")}`;
}
