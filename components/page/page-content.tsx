"use client";
import { useState } from "react";
import styles from "./page.module.scss";
import TabGroup from "../tabs/tab-group";
import Tab from "../tabs/tab";
import { LiftAndWeightData } from "@/lib/google-sheets";
import Leaderboard from "../leaderboard/leaderboard";

interface Props {
  liftAndWeightData: LiftAndWeightData;
}

const TABS: string[] = ["squanch", "bunch", "dunch", "chonk"];

export default function PageContent({ liftAndWeightData }: Props) {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  return (
    <>
      <TabGroup>
        {TABS.map((tabName: string) => (
          <Tab active={activeTab == tabName} onClick={() => setActiveTab(tabName)} key={tabName} label={tabName} />
        ))}
      </TabGroup>
      <div className={styles["page-content"]}>
        {TABS.map((tabName: string) => {
          return (
            <Leaderboard
              data={liftAndWeightData[tabName]}
              active={activeTab == tabName}
              title={tabName}
              key={tabName}
            />
          );
        })}
      </div>
    </>
  );
}
