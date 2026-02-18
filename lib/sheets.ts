import { google } from "googleapis"

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined

  // Remove surrounding quotes if present (common when copy-pasting)
  let formatted = key.replace(/^["']|["']$/g, "")

  // Replace all literal \n sequences with real newlines
  formatted = formatted.replace(/\\n/g, "\n")

  // If the key doesn't have proper PEM headers, it might be base64-only
  if (!formatted.includes("-----BEGIN")) {
    formatted = `-----BEGIN PRIVATE KEY-----\n${formatted}\n-----END PRIVATE KEY-----\n`
  }

  return formatted
}

function getAuth() {
  const privateKey = formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY)

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
