import { client } from "@/lib/prismic";
import TourViewer from "@/components/TourViewer";

export default async function Home() {
  const scenes = await client.getAllByType("seine_bureau");

  return <TourViewer scenes={scenes} />;
}
