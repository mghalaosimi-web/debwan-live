import FootballPlayerDetail from "@/components/football/football-player-detail";

export default function FootballPlayerPage({ params }: { params: { slug: string } }) {
  return <FootballPlayerDetail slug={params.slug} />;
}
