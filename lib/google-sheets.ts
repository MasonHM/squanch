import "server-only";
import * as google from "@googleapis/sheets";
import { GaxiosResponse } from "gaxios";

const googleSheetsAuth = google.auth.fromAPIKey(process.env.GOOGLE_SHEETS_API_KEY || "");
const sheets = google.sheets({ version: "v4", auth: googleSheetsAuth });

const CHONK_CELL_RANGE = "Bunch (v2)!A2:H3";
const BUNCH_CELL_RANGE = "Bunch (v2)!K2:Q82";
const SQUANCH_CELL_RANGE = "Squanch (v2)!K2:Q81";
const DUNCH_CELL_RANGE = "Dunch (v2)!K2:Q81";
const FIVE_MINUTES_IN_MILLIS = 5 * 60 * 1000;

export type WeightData = {
  [name: string]: number;
};

export type CombinedData = {
  [index: string]: WeightData;
  squanch: WeightData;
  bunch: WeightData;
  dunch: WeightData;
  chonk: WeightData;
};

let cachedData: CombinedData;
let cacheExpiryTime: Date;

export async function getAllData(): Promise<CombinedData> {
  const now = new Date();
  if (!cachedData || (cacheExpiryTime && cacheExpiryTime < now)) {
    const chonkDataRequest: Promise<WeightData> = getChonkData();
    const squanchDataRequest: Promise<WeightData> = getSquanchData();
    const bunchDataRequest: Promise<WeightData> = getBunchData();
    const dunchDataRequest: Promise<WeightData> = getDunchData();

    const [chonkData, squanchData, bunchData, dunchData] = await Promise.all([
      chonkDataRequest,
      squanchDataRequest,
      bunchDataRequest,
      dunchDataRequest,
    ]);

    cacheExpiryTime = new Date(now.getTime() + FIVE_MINUTES_IN_MILLIS);
    cachedData = { squanch: squanchData, bunch: bunchData, dunch: dunchData, chonk: chonkData };
  }

  return cachedData;
}

export async function getSquanchData(): Promise<WeightData> {
  return await getLiftData(SQUANCH_CELL_RANGE);
}

export async function getBunchData(): Promise<WeightData> {
  return await getLiftData(BUNCH_CELL_RANGE);
}

export async function getDunchData(): Promise<WeightData> {
  return await getLiftData(DUNCH_CELL_RANGE);
}

export async function getChonkData(): Promise<WeightData> {
  return await getWeightData();
}

async function getWeightData(): Promise<WeightData> {
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

async function getLiftData(range: string): Promise<WeightData> {
  try {
    const response = await getData(range);
    if (response.data.values) {
      const result = processLiftRows(response.data.values);
      return result;
    }
  } catch (err) {
    console.log(err);
  }

  return {};
}

function processWeightRows(rows: any[][]): WeightData {
  const names = rows[0];
  const weights = rows[1];
  const result: WeightData = {};

  // For each name (column), the corresponding weight is directly below
  for (let i = 0; i < names.length; i++) {
    if (names[i] != "") {
      result[names[i]] = weights[i];
    }
  }

  return result;
}

function processLiftRows(rows: any[][]): WeightData {
  const names = rows[0];
  const result: WeightData = {};

  // For each name (column), look for the lowest non-empty cell
  for (let i = 0; i < names.length; i++) {
    let latestLift = 0;
    for (let j = 1; j < rows.length; j++) {
      const currLift = rows[j][i];
      if (currLift) latestLift = currLift;
    }
    result[names[i]] = latestLift;
  }

  return result;
}

function getData(range: string): Promise<GaxiosResponse<google.sheets_v4.Schema$ValueRange>> {
  return sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: range,
  });
}
