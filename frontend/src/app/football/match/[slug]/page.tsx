import FootballMatchDetail from "@/components/football/football-match-detail";

export default function FootballMatchPage({ params }: { params: { slug: string } }) {
  return <FootballMatchDetail slug={params.slug} />;
}
