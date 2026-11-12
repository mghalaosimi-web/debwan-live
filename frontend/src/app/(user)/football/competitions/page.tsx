import FootballSectionLayout from "@/components/football/football-section-layout";
import FootballMatches from "@/components/football/football-matches";
export default function FootballCompetitionsPage() {
 return <FootballSectionLayout title="مباريات البطولات" eyebrow="COMPETITIONS" description="الدوريات الخمسة الكبرى ودوري روشن والبطولات الأوروبية الكبرى."><FootballMatches /></FootballSectionLayout>;
}
