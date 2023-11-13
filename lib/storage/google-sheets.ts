import "server-only";
import * as google from "@googleapis/sheets";
import { CACHE_EXPIRY_TIME_MILLIS } from "../constants";
import { CombinedData, LiftData, WeightMap } from "./data";

const googleSheetsAuth = google.auth.fromAPIKey(process.env.GOOGLE_SHEETS_API_KEY || "");
const sheets = google.sheets({ version: "v4", auth: googleSheetsAuth });

const CHONK_CELL_RANGE = "Bunch (v2)!A2:H3";
const BUNCH_CELL_RANGE = "Bunch (v2)!K2:Q82";
const SQUANCH_CELL_RANGE = "Squanch (v2)!K2:Q81";
const DUNCH_CELL_RANGE = "Dunch (v2)!K2:Q81";
const DATE_CELL_RANGE = "Bunch (v2)!A4:A82";

export async function getSquanchData(): Promise<LiftData[]> {
  return processLiftRows(await getData(SQUANCH_CELL_RANGE));
}

export async function getBunchData(): Promise<LiftData[]> {
  return processLiftRows(await getData(BUNCH_CELL_RANGE), true);
}

export async function getDunchData(): Promise<LiftData[]> {
  return processLiftRows(await getData(DUNCH_CELL_RANGE));
}

export async function getChonkData(): Promise<WeightMap> {
  return processWeightRows(await getData(CHONK_CELL_RANGE));
}

export async function getAllData(): Promise<CombinedData> {
  const chonkDataRequest: Promise<WeightMap> = getChonkData();
  const squanchDataRequest: Promise<LiftData[]> = getSquanchData();
  const bunchDataRequest: Promise<LiftData[]> = getBunchData();
  const dunchDataRequest: Promise<LiftData[]> = getDunchData();
  const dateRangeRequest: Promise<string[]> = getDateRangeForGraph();

  const [chonkData, squanchData, bunchData, dunchData, dateRange] = await Promise.all([
    chonkDataRequest,
    squanchDataRequest,
    bunchDataRequest,
    dunchDataRequest,
    dateRangeRequest,
  ]);

  const combinedData: CombinedData = {
    liftData: { squanch: squanchData, bunch: bunchData, dunch: dunchData },
    weightData: chonkData,
    graphLabels: dateRange,
  };

  return combinedData;
}

async function getDateRangeForGraph(): Promise<string[]> {
  return processDatesForGraph(await getData(DATE_CELL_RANGE));
}

function processWeightRows(rows: any[][]): WeightMap {
  const names = rows[0];
  const weights = rows[1];
  const result: WeightMap = {};

  // For each name (column), the corresponding weight is directly below
  for (let i = 0; i < names.length; i++) {
    if (names[i] != "") {
      result[names[i]] = Number(weights[i]);
    }
  }

  return result;
}

function processLiftRows(rows: any[][], removeFirstDataRow: boolean = false): LiftData[] {
  const names = rows[0];
  const result: LiftData[] = [];

  // For each name (column), curr1RM is the lowest non-empty cell
  for (let i = 0; i < names.length; i++) {
    let curr1RM = 0;
    const rawData: { [index: number]: number } = {};
    for (let j = 1; j < rows.length; j++) {
      const currLift = Number(rows[j][i]);
      if (currLift) {
        curr1RM = currLift;
        const indicesToSubtract = removeFirstDataRow ? 2 : 1;
        rawData[j - indicesToSubtract] = currLift;
      }
    }
    result.push({ name: names[i], curr1RM: curr1RM, raw: rawData });
  }

  return result;
}

function processDatesForGraph(rows: any[][]): string[] {
  return rows.map((row) => row[0]);
}

const rawDataCache: {
  [key: string]: {
    data: any[][];
    expiryTime: Date;
  };
} = {};

async function getData(range: string): Promise<any[][]> {
  const now = new Date();
  let cachedData = rawDataCache[range];
  try {
    if (!cachedData || (cachedData.expiryTime && cachedData.expiryTime < now)) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: range,
      });
      if (response.data.values) {
        const expiryTime = new Date(now.getTime() + CACHE_EXPIRY_TIME_MILLIS);
        cachedData = { data: response.data.values, expiryTime: expiryTime };
      } else {
        cachedData = { data: [], expiryTime: now };
      }
      rawDataCache[range] = cachedData;
    } else {
    }
  } catch (error) {
    console.log(error);
  }

  return cachedData.data;
}
