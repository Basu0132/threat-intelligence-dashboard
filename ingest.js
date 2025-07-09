const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Pool } = require('pg');

// PostgreSQL pool setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'threat_intelligence',
  password: 'root',
  port: 5432,
});

async function insertThreat(threat) {
  const query = `
    INSERT INTO threats (cleaned_threat_description, threat_category, severity_score)
    VALUES ($1, $2, $3)
  `;
  await pool.query(query, [
    threat.cleaned_threat_description,
    threat.threat_category,
    threat.severity_score
  ]);
}

async function main() {
  const filePath = path.join(__dirname, 'Cybersecurity_Dataset.csv'); 

  const promises = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const cleaned = row.Cleaned_Threat_Description;
      const category = row.Threat_Category;
      const severity = row.Severity_Score;
    
      // Skip rows with missing description
      if (!cleaned || cleaned.trim() === '') {
        console.log('Skipping empty row:', row);
        return;
      }
  
      const threat = {
        cleaned_threat_description: cleaned,
        threat_category: category,
        severity_score: severity
      };
      promises.push(insertThreat(threat));
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');
      await Promise.all(promises);
      console.log('All data inserted.');
      await pool.end();
    });
}

main();
