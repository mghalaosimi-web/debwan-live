import FootballSectionLayout from "@/components/football/football-section-layout";
import FootballDirectory from "@/components/football/football-directory";
export default function FootballTeamsPage() {
 return <FootballSectionLayout title="الأندية واللاعبون" eyebrow="CLUBS & PLAYERS" description="ابحث عن الأندية واللاعبين ضمن البطولات المعتمدة."><FootballDirectory /></FootballSectionLayout>;
}
