import "server-only";
import * as google from "@googleapis/sheets";
import { GaxiosResponse } from "gaxios";
import { CACHE_EXPIRY_TIME_MILLIS } from "./constants";

const googleSheetsAuth = google.auth.fromAPIKey(process.env.GOOGLE_SHEETS_API_KEY || "");
const sheets = google.sheets({ version: "v4", auth: googleSheetsAuth });

const CHONK_CELL_RANGE = "Bunch (v2)!A2:H3";
const BUNCH_CELL_RANGE = "Bunch (v2)!K2:Q82";
const SQUANCH_CELL_RANGE = "Squanch (v2)!K2:Q81";
const DUNCH_CELL_RANGE = "Dunch (v2)!K2:Q81";

export type LiftArray = {
  name: string;
  weight: number;
}[];

export type WeightMap = {
  [name: string]: number;
};

export type CombinedData = {
  liftData: {
    [name: string]: LiftArray;
    squanch: LiftArray;
    bunch: LiftArray;
    dunch: LiftArray;
  };
  chonk: WeightMap;
};

export async function getAllData(): Promise<CombinedData> {
  const chonkDataRequest: Promise<WeightMap> = getCachedWeightMapDataOrFallback(getChonkData);
  const squanchDataRequest: Promise<LiftArray> = getCachedLiftArrayDataOrFallback("squanch", getSquanchData);
  const bunchDataRequest: Promise<LiftArray> = getCachedLiftArrayDataOrFallback("bunch", getBunchData);
  const dunchDataRequest: Promise<LiftArray> = getCachedLiftArrayDataOrFallback("dunch", getDunchData);

  const [chonkData, squanchData, bunchData, dunchData] = await Promise.all([
    chonkDataRequest,
    squanchDataRequest,
    bunchDataRequest,
    dunchDataRequest,
  ]);

  const combinedData: CombinedData = {
    liftData: { squanch: squanchData, bunch: bunchData, dunch: dunchData },
    chonk: chonkData,
  };

  return combinedData;
}

export async function getSquanchData(): Promise<LiftArray> {
  return await getLiftData(SQUANCH_CELL_RANGE);
}

export async function getBunchData(): Promise<LiftArray> {
  return await getLiftData(BUNCH_CELL_RANGE);
}

export async function getDunchData(): Promise<LiftArray> {
  return await getLiftData(DUNCH_CELL_RANGE);
}

export async function getChonkData(): Promise<WeightMap> {
  return await getWeightData();
}

let cachedLiftArrayData: {
  [key: string]: {
    data: LiftArray;
    expiryTime: Date;
  };
} = {};
export async function getCachedLiftArrayDataOrFallback(
  cacheKey: string,
  fallback: () => Promise<LiftArray>
): Promise<LiftArray> {
  let cachedData = cachedLiftArrayData[cacheKey];
  const now = new Date();
  if (!cachedData || (cachedData.expiryTime && cachedData.expiryTime < now)) {
    const data: LiftArray = await fallback();
    const expiryTime = new Date(now.getTime() + CACHE_EXPIRY_TIME_MILLIS);
    cachedData = { data: data, expiryTime: expiryTime };
    cachedLiftArrayData[cacheKey] = cachedData;
  }
  return cachedData.data;
}

let cachedWeightMap: {
  data: WeightMap;
  expiryTime: Date;
};
export async function getCachedWeightMapDataOrFallback(fallback: () => Promise<WeightMap>): Promise<WeightMap> {
  const now = new Date();
  if (!cachedWeightMap || (cachedWeightMap.expiryTime && cachedWeightMap.expiryTime < now)) {
    const data: WeightMap = await fallback();
    const expiryTime = new Date(now.getTime() + CACHE_EXPIRY_TIME_MILLIS);
    cachedWeightMap = { data: data, expiryTime: expiryTime };
  }
  return cachedWeightMap.data;
}

async function getWeightData(): Promise<WeightMap> {
  try {
    const response = await getData(CHONK_CELL_RANGE);
    if (response.data.values) {
      const result = processWeightRows(response.data.values);
      return result;
    }
  } catch (err) {
    console.log(err);
  }

  return {};
}

async function getLiftData(range: string): Promise<LiftArray> {
  try {
    const response = await getData(range);
    if (response.data.values) {
      const result = processLiftRows(response.data.values);
      return result;
    }
  } catch (err) {
    console.log(err);
  }

  return [];
}

function processWeightRows(rows: any[][]): WeightMap {
  const names = rows[0];
  const weights = rows[1];
  const result: WeightMap = {};

  // For each name (column), the corresponding weight is directly below
  for (let i = 0; i < names.length; i++) {
    if (names[i] != "") {
      result[names[i]] = weights[i];
    }
  }

  return result;
}

function processLiftRows(rows: any[][]): LiftArray {
  const names = rows[0];
  const result: LiftArray = [];

  // For each name (column), look for the lowest non-empty cell
  for (let i = 0; i < names.length; i++) {
    let latestLift = 0;
    for (let j = 1; j < rows.length; j++) {
      const currLift = rows[j][i];
      if (currLift) latestLift = currLift;
    }
    result.push({ name: names[i], weight: latestLift });
  }

  return result;
}

function getData(range: string): Promise<GaxiosResponse<google.sheets_v4.Schema$ValueRange>> {
  return sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: range,
  });
}
