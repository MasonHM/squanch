"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import TabGroup from "../tabs/tab-group";
import Tab from "../tabs/tab";
import { CombinedData, LiftArray } from "@/lib/google-sheets";
import Footer from "./footer";
import { TabCycle } from "../tabs/tab-cycle";
import { LiftTabContent, WeightTabContent } from "../tabs/tab-content";
import ChonkProvider from "../../lib/context-providers/chonk-provider";
import LeaderboardSortProvider from "@/lib/context-providers/sort-provider";

interface Props {
  liftAndWeightData: CombinedData;
}

const TABS: string[] = ["squanch", "bunch", "dunch", "chonk"];

export default function PageContent({ liftAndWeightData }: Props) {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const tcRef: MutableRefObject<TabCycle | undefined> = useRef();
  const cycleTabFunc = () => {
    setActiveTabIndex((i) => (i + 1) % TABS.length);
  };

  const weightData: { [index: string]: LiftArray } = {
    squanch: liftAndWeightData.squanch,
    bunch: liftAndWeightData.bunch,
    dunch: liftAndWeightData.dunch,
  };

  useEffect(() => {
    const tc: TabCycle = new TabCycle(cycleTabFunc);
    tcRef.current = tc;
    tc.startInterval();
    return tc.stopInterval.bind(tc);
  }, []);

  return (
    <>
      <TabGroup>
        {TABS.map((tabName: string, index: number) => (
          <Tab
            selected={activeTabIndex == index}
            onClick={() => {
              setActiveTabIndex(index);
              tcRef.current?.stopInterval();
            }}
            key={tabName}
            label={tabName}
          />
        ))}
      </TabGroup>
      <div className={styles.content}>
        <ChonkProvider initialData={liftAndWeightData.chonk}>
          <LeaderboardSortProvider>
            {TABS.map((tabName: string, index: number) =>
              tabName == "chonk" ? (
                <WeightTabContent
                  data={liftAndWeightData[tabName]}
                  tabName={tabName}
                  active={activeTabIndex == index}
                  key={tabName}
                />
              ) : (
                <LiftTabContent
                  initialData={weightData[tabName]}
                  tabName={tabName}
                  active={activeTabIndex == index}
                  key={tabName}
                />
              )
            )}
          </LeaderboardSortProvider>
        </ChonkProvider>

        <Footer
          startLoops={tcRef.current?.startInterval.bind(tcRef.current)}
          stopLoops={tcRef.current?.stopInterval.bind(tcRef.current)}
          fasterLoops={tcRef.current?.fasterInterval.bind(tcRef.current)}
        />
      </div>
    </>
  );
}
