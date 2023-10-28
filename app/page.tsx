import PageContent from "@/components/page/page-content";
import { ReactElement } from "react";
import { getAllData } from "@/lib/google-sheets";

export default async function Home(): Promise<ReactElement> {
  const liftAndWeightData = await getAllData();

  return (
    <main>
      <PageContent liftAndWeightData={liftAndWeightData} />
    </main>
  );
}
