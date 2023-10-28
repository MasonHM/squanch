"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "./page.module.scss";
import TabGroup from "../tabs/tab-group";
import Tab from "../tabs/tab";
import { LiftAndWeightData } from "@/lib/google-sheets";
import Leaderboard from "../leaderboard/leaderboard";
import Footer from "./footer";
import { TabCycle } from "./tab-cycle";

interface Props {
  liftAndWeightData: LiftAndWeightData;
}

const TABS: string[] = ["squanch", "bunch", "dunch", "chonk"];

export default function PageContent({ liftAndWeightData }: Props) {
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
    <>
      <TabGroup>
        {TABS.map((tabName: string, index: number) => (
          <Tab
            active={activeTabIndex == index}
            onClick={() => {
              setActiveTabIndex(index);
              tcRef.current?.stopInterval();
            }}
            key={tabName}
            label={tabName}
          />
        ))}
      </TabGroup>
      <div className={styles["page-content"]}>
        {TABS.map((tabName: string, index: number) => {
          return (
            <Leaderboard
              data={liftAndWeightData[tabName]}
              active={activeTabIndex == index}
              title={tabName}
              key={tabName}
            />
          );
        })}
        <Footer
          startLoops={tcRef.current?.startInterval.bind(tcRef.current)}
          stopLoops={tcRef.current?.stopInterval.bind(tcRef.current)}
          fasterLoops={tcRef.current?.fasterInterval.bind(tcRef.current)}
        />
      </div>
    </>
  );
}
