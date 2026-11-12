import FootballSectionLayout from "@/components/football/football-section-layout";
import FootballGlobalMatches from "@/components/football/football-global-matches";
export default function FootballMatchesPage() {
 return <FootballSectionLayout title="مباريات اليوم" eyebrow="MATCH CENTRE" description="المباريات المباشرة والقادمة والنتائج النهائية."><FootballGlobalMatches /></FootballSectionLayout>;
}
