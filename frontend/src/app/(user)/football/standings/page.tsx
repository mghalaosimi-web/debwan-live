import FootballSectionLayout from "@/components/football/football-section-layout";
import FootballStandings from "@/components/football/football-standings";
export default function FootballStandingsPage() {
 return <FootballSectionLayout title="ترتيب الدوريات" eyebrow="LEAGUE TABLES" description="جداول الترتيب والنقاط وفارق الأهداف للدوريات الأساسية."><FootballStandings /></FootballSectionLayout>;
}
