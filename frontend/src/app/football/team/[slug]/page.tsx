import FootballTeamDetail from "@/components/football/football-team-detail";
export default function FootballTeamPage({params}:{params:{slug:string}}){return <FootballTeamDetail slug={params.slug}/>;}
