import * as XLSX from "xlsx";

export function parseExcelToRows(file, setRows) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const wb = XLSX.read(e.target.result, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, { defval: "" });

    let currentGroup = null;
    const rows = [];

    for (const r of json) {
      const name = String(r.Category || "").trim();
      const raw = r["Monthly Amount"];

      if (!name) continue;

      const cleaned = Number(String(raw).replace(/[$,]/g, ""));
      const isHeader =
        raw === "" ||
        raw === null ||
        raw === undefined ||
        Number.isNaN(cleaned);

      // Category header row
      if (isHeader) {
        currentGroup = name;
        continue;
      }

      rows.push({
        group: currentGroup || "Uncategorized",
        category: name,
        amount: cleaned,
      });
    }

    setRows(rows);
  };

  reader.readAsArrayBuffer(file);
}

export function parseExcelToRowsFromBuffer(buffer, setRows) {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  let currentGroup = null;
  const rows = [];

  for (const r of json) {
    const name = String(r.Category || "").trim();
    const raw = r["Monthly Amount"];

    if (!name) continue;

    const value = Number(String(raw).replace(/[$,]/g, ""));
    const isHeader =
      raw === "" ||
      raw === null ||
      raw === undefined ||
      Number.isNaN(value);

    // Category header row
    if (isHeader) {
      currentGroup = name;
      continue;
    }

    rows.push({
      group: currentGroup || "Uncategorized",
      category: name,
      amount: value,
    });
  }

  setRows(rows);
}

