export type CutoutAsset = {
  title: string;
  label: string;
  category: string;
  description: string;
  src: string;
  tall?: boolean;
};

export const heroCutouts: CutoutAsset[] = [
  {
    title: "Pet cutout",
    label: "dog",
    category: "Pets",
    description: "A golden retriever standee staged in the fabrication studio.",
    src: "/assets/DogPetCutout.png",
  },
  {
    title: "Family cutout",
    label: "grandmother",
    category: "Family",
    description: "A life-size grandmother cutout with a clean contour border.",
    src: "/assets/GrandmotherCutout.png",
    tall: true,
  },
  {
    title: "Birthday cutout",
    label: "birthday guest",
    category: "Events",
    description: "A party-ready birthday standee on a printed base.",
    src: "/assets/BirthdayBoyCutout.png",
  },
  {
    title: "Creator cutout",
    label: "fashion creator",
    category: "Creators",
    description: "A polished creator standee photographed in the shop.",
    src: "/assets/InfluencerWomanCutout.png",
    tall: true,
  },
  {
    title: "Mascot cutout",
    label: "mascot",
    category: "Schools",
    description: "A school mascot sign cut with a bold white outline.",
    src: "/assets/SchoolMascot.png",
  },
];

export const galleryCutouts: CutoutAsset[] = [
  ...heroCutouts,
  {
    title: "Wedding photo booth",
    label: "wedding couple",
    category: "Weddings",
    description: "A full-height couple standee built for reception photo ops.",
    src: "/assets/WeddingCoupleCutout.png",
    tall: true,
  },
  {
    title: "Youth sports display",
    label: "soccer player",
    category: "Sports",
    description: "A team-season cutout with uniform detail and black support feet.",
    src: "/assets/SoccerPlayerCutout.png",
    tall: true,
  },
  {
    title: "Trade show presenter",
    label: "trade show",
    category: "Business",
    description: "A polished presenter cutout for booths, launches, and events.",
    src: "/assets/TradeShowPresenterCutout.png",
    tall: true,
  },
  {
    title: "Celebrity-style gift",
    label: "celebrity",
    category: "Gifts",
    description: "A suited character standee made for a surprise birthday setup.",
    src: "/assets/CelebrityCutout.png",
    tall: true,
  },
  {
    title: "Character duo",
    label: "characters",
    category: "Characters",
    description: "A dramatic two-person character cutout staged in production.",
    src: "/assets/CharacterCutout.png",
    tall: true,
  },
  {
    title: "Production floor",
    label: "fabrication",
    category: "Quality",
    description: "The studio floor where rigid boards are printed, cut, and packed.",
    src: "/assets/FabricationStudio.png",
  },
  {
    title: "Cutout archive",
    label: "signs galore",
    category: "Volume",
    description: "A large production run showing the range of possible subjects.",
    src: "/assets/SignsGalore.png",
  },
];
