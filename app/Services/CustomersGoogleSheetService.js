const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const Env = use('Env')


class GoogleSheetService {
  constructor() {
    const keyFile = path.join(__dirname, 'credentials.json'); // ไฟล์ Service Account
    const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    const auth = new google.auth.GoogleAuth({ keyFile, scopes });

    this.client = google.sheets({ version: 'v4', auth });
  }

  async getSheetData(sheetId, range) {
    try {
      const response = await this.client.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
      });
      return response.data.values || [];
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      throw error;
    }
  }
}

module.exports = new GoogleSheetService();
