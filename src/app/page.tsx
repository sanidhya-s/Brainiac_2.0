"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { processQuery, AIResponse } from "@/services/mockAi";
import GenerativeUI from "@/components/GenerativeUI";
import { Upload } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      setData(jsonData);
      // Optional: run initial analysis
    };
    reader.readAsBinaryString(file);
  };

  const handleSend = async () => {
    if (!query.trim()) return;
    setIsProcessing(true);
    try {
      const result = await processQuery(query, data);
      setAiData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased pb-20 md:pb-0 min-h-screen">
      {/* TopAppBar */}
      <header className="docked full-width top-0 bg-surface text-primary border-b border-outline-variant transition-colors duration-200 ease-in-out flex justify-between items-center w-full px-4 h-16 sticky z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
            U
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary">Lumina Intelligence</span>
        </div>
        <div className="flex items-center gap-2">
          {data.length === 0 && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-surface-container-low text-primary px-3 py-1.5 rounded-full hover:bg-surface-container border border-outline-variant transition-colors text-label-md font-label-md"
            >
              <Upload size={16} />
              Upload Data
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
          />
          <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200 ease-in-out">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>search</span>
          </button>
        </div>
      </header>

      <main className="p-margin-mobile md:p-margin-desktop space-y-lg max-w-[1440px] mx-auto mt-6">
        {/* Ask AI Query Bar */}
        <section>
          <div className="relative w-full rounded-full bg-surface-container-lowest border border-outline-variant shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-fixed transition-all duration-300 flex items-center p-2 pl-4">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            <input 
              className="w-full bg-transparent border-none focus:outline-none text-body-md text-on-surface ml-2 placeholder-on-surface-variant" 
              placeholder={data.length === 0 ? "Upload data first to ask questions..." : "Ask Lumina anything about your data..."} 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={data.length === 0 || isProcessing}
            />
            <button 
              onClick={handleSend}
              disabled={data.length === 0 || isProcessing}
              className="bg-primary text-on-primary rounded-full p-2 hover:bg-primary-container transition-colors shadow-sm ml-2 flex items-center justify-center disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">send</span>
              )}
            </button>
          </div>
        </section>

        {aiData?.uiSchema ? (
          /* GENERATIVE UI CANVAS */
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-4">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                AI Generated Analysis
              </h2>
            </div>
            <GenerativeUI schema={aiData.uiSchema} data={data} />
          </section>
        ) : (
          /* DEFAULT STITCH DASHBOARD PLACEHOLDERS */
          <>
            <section>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Top Insights</h2>
              <div className="grid grid-cols-2 gap-md md:grid-cols-3">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-md text-label-md text-on-surface-variant">Data Rows</span>
                    <div className="bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full font-label-sm text-label-sm flex items-center">
                      <span className="material-symbols-outlined text-[14px] mr-1">database</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">{data.length || '--'}</div>
                    <div className="mt-sm h-8 w-full bg-surface-container rounded-sm overflow-hidden relative">
                       <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-primary-fixed to-transparent opacity-50"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-md text-label-md text-on-surface-variant">Columns</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">
                      {data.length > 0 ? Object.keys(data[0]).length : '--'}
                    </div>
                    <div className="mt-sm h-8 w-full bg-surface-container rounded-sm overflow-hidden relative"></div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex flex-col justify-between hover:shadow-md transition-shadow col-span-2 md:col-span-1">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-md text-label-md text-on-surface-variant">System Status</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface text-primary">Ready</div>
                    <div className="mt-sm h-8 w-full flex items-end gap-1">
                      <div className="w-1/6 bg-primary h-3/4 rounded-t-sm"></div>
                      <div className="w-1/6 bg-primary h-4/5 rounded-t-sm"></div>
                      <div className="w-1/6 bg-primary h-full rounded-t-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
                <div className="flex justify-between items-center mb-md">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Upload Data to Begin</h2>
                </div>
                <div className="w-full h-48 bg-surface-container rounded-lg border border-outline-variant border-dashed flex flex-col justify-center items-center text-on-surface-variant">
                  <Upload size={32} className="mb-2 opacity-50" />
                  <p>Awaiting dataset for Generative UI analysis...</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden docked full-width bottom-0 rounded-t-xl bg-surface text-primary font-label-md text-label-md border-t border-outline-variant shadow-lg fixed w-full z-50 flex justify-around items-center px-2 py-3">
        <a className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 scale-95 transition-transform duration-150" href="#">
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span>Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:text-primary transition-colors duration-150" href="#">
          <span className="material-symbols-outlined text-[24px]">insights</span>
          <span>Insights</span>
        </a>
      </nav>
    </div>
  );
}
