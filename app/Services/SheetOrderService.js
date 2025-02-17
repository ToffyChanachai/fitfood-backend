const { google } = require("googleapis");
const path = require('path');
const Env = use('Env')

class GoogleSheetController {
  constructor(sheetId) {
    const keyFile = path.join(__dirname, "credentials.json"); // ไฟล์ Service Account
    this.sheetId = sheetId;
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    this.client = google.sheets({ version: "v4", auth });
  }

  async getSheetData(range) {
    const response = await this.client.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range,
    });
    const [header, ...rows] = response.data.values;
    return { header, rows };
  }
}

module.exports = GoogleSheetController;
