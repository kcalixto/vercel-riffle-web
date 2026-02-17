import { google } from "googleapis"

function getAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
      project_id: process.env.GOOGLE_PROJECT_ID,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
}

function getSheets() {
  const auth = getAuth()
  return google.sheets({ version: "v4", auth })
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID!
const RANGE_ALL = "Sheet1!A2:G201"

export interface RaffleRow {
  id: number
  nome: string
  whatsapp: string
  timestamp: string
  formPreenchido: string
  pago: string
  status: string
}

export async function getAvailableNumbers(): Promise<number[]> {
  const sheets = getSheets()

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE_ALL,
  })

  const rows = response.data.values || []
  const available: number[] = []

  for (const row of rows) {
    const id = parseInt(row[0], 10)
    const status = (row[6] || "").toString().toLowerCase().trim()

    if (status === "available") {
      available.push(id)
    }
  }

  return available.sort((a, b) => a - b)
}

export async function reserveNumbers(
  numbers: number[],
  nome: string,
  whatsapp: string
): Promise<{ success: boolean; error?: string }> {
  const sheets = getSheets()

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE_ALL,
  })

  const rows = response.data.values || []
  const timestamp = new Date().toISOString()

  const updates: { range: string; values: string[][] }[] = []

  for (const num of numbers) {
    const rowIndex = rows.findIndex(
      (row) => parseInt(row[0], 10) === num
    )

    if (rowIndex === -1) {
      return { success: false, error: `Numero ${num} nao encontrado.` }
    }

    const currentStatus = (rows[rowIndex][6] || "").toString().toLowerCase().trim()
    if (currentStatus !== "available") {
      return {
        success: false,
        error: `Numero ${num} nao esta mais disponivel.`,
      }
    }

    const sheetRow = rowIndex + 2
    updates.push({
      range: `Sheet1!B${sheetRow}:G${sheetRow}`,
      values: [[nome, whatsapp, timestamp, "TRUE", "", "reserved"]],
    })
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: updates,
    },
  })

  return { success: true }
}
