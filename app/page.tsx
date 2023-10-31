"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import TabGroup from "../components/tabs/tab-group";
import Tab from "../components/tabs/tab";
import Footer from "../components/layout/footer";
import { TabCycle } from "../components/tabs/tab-cycle";
import { LiftTabContent, WeightTabContent } from "../components/tabs/tab-content";
import LeaderboardSortProvider from "@/lib/context-providers/sort-provider";
import DataProvider from "@/lib/context-providers/data-provider";

const TABS: string[] = ["squanch", "bunch", "dunch", "chonk"];

export default function Home() {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const tcRef: MutableRefObject<TabCycle | undefined> = useRef();
  const cycleTabFunc = () => {
    setActiveTabIndex((i) => (i + 1) % TABS.length);
  };

  useEffect(() => {
    const tc: TabCycle = new TabCycle(cycleTabFunc);
    tcRef.current = tc;
    tc.startInterval();
    return tc.stopInterval.bind(tc);
  }, []);

  return (
    <div className={styles.page}>
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
        <DataProvider>
          <LeaderboardSortProvider>
            {TABS.map((tabName: string, index: number) =>
              tabName == "chonk" ? (
                <WeightTabContent tabName={tabName} active={activeTabIndex == index} key={tabName} />
              ) : (
                <LiftTabContent tabName={tabName} active={activeTabIndex == index} key={tabName} />
              )
            )}
          </LeaderboardSortProvider>
        </DataProvider>

        <Footer
          startLoops={tcRef.current?.startInterval.bind(tcRef.current)}
          stopLoops={tcRef.current?.stopInterval.bind(tcRef.current)}
          fasterLoops={tcRef.current?.fasterInterval.bind(tcRef.current)}
        />
      </div>
    </div>
  );
}
