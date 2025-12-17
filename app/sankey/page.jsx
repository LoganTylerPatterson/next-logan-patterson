"use client";
import React from "react";
import BudgetSankey from "@/components/SankeyBudget/BudgetSankey";
import { parseExcelToRows, parseExcelToRowsFromBuffer } from "@/components/SankeyBudget/parseExcel";
import { buildCategorizedSankey } from "@/components/SankeyBudget/buildSankyData";
import styles from "./page.module.css";

export default function Page() {
  const [rows, setRows] = React.useState([]);

  const data = React.useMemo(
    () => buildCategorizedSankey(rows),
    [rows]
  );

  async function loadSampleFromPublic() {
    const res = await fetch("/samples/budget-sample-categories.xlsx");
    const buffer = await res.arrayBuffer();
    parseExcelToRowsFromBuffer(buffer, setRows);
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.fileInputWrapper}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) =>
            e.target.files &&
            parseExcelToRows(e.target.files[0], setRows)
          }
        />

        <button className={styles.primary} onClick={loadSampleFromPublic}>
          Load Sample Data
        </button>

        <a
  href="/samples/budget-sample-categories.xlsx"
  download
>
  Download Sample Excel
</a>

      </div>

      {rows.length > 0 && <BudgetSankey data={data} />}
    </div>
  );
}
