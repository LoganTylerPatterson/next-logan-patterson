"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BudgetSankey from "@/components/SankeyBudget/BudgetSankey";
import { parseExcelToRows, parseExcelToRowsFromBuffer } from "@/components/SankeyBudget/parseExcel";
import { buildCategorizedSankey } from "@/components/SankeyBudget/buildSankyData";
import styles from "./page.module.css";

export default function Page() {
  const router = useRouter();
  const [rows, setRows] = React.useState([]);
  const [fileName, setFileName] = React.useState(null);

  const data = React.useMemo(() => buildCategorizedSankey(rows), [rows]);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    parseExcelToRows(file, setRows);
  }

  async function loadSample() {
    const res = await fetch("/samples/budget-sample-categories.xlsx");
    const buffer = await res.arrayBuffer();
    setFileName("budget-sample-categories.xlsx");
    parseExcelToRowsFromBuffer(buffer, setRows);
  }

  return (
    <div className={styles.pageContainer}>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>← BACK</button>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>BUDGET SANKEY</h1>
          <p className={styles.subtitle}>FINANCIAL FLOW VISUALIZATION</p>
        </div>
        <div className={styles.headerSpacer} />
      </div>

      <div className={styles.controls}>
        <label className={styles.fileLabel}>
          ↑ UPLOAD EXCEL
          <input
            className={styles.fileInput}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
          />
        </label>

        <div className={styles.divider} />

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={loadSample}>
          LOAD SAMPLE
        </button>

        <a className={styles.btn} href="/samples/budget-sample-categories.xlsx" download>
          DOWNLOAD TEMPLATE
        </a>

        {fileName && (
          <>
            <div className={styles.divider} />
            <span className={styles.fileName}>{fileName}</span>
          </>
        )}
      </div>

      {rows.length > 0 ? (
        <div className={styles.chartWrapper}>
          <BudgetSankey data={data} />
        </div>
      ) : (
        <div className={styles.empty}>
          UPLOAD AN EXCEL FILE OR LOAD SAMPLE DATA<br />
          TO VISUALIZE YOUR BUDGET FLOW
        </div>
      )}

    </div>
  );
}
