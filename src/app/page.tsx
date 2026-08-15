"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { processQuery, AIResponse } from "@/services/mockAi";
import GenerativeUI from "@/components/GenerativeUI";
import { Upload, FileDown, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{ query: string, aiData: AIResponse }[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (jsonData: any[]) => {
    try {
      const dataSchema = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataSchema })
      });
      const result = await res.json();
      if (result.suggestions) {
        setSuggestions(result.suggestions);
      }
    } catch (e) {
      console.error("Failed to fetch suggestions", e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    setUploadStatus("Reading file...");

    const reader = new FileReader();
    
    reader.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        setUploadProgress(percentLoaded);
      }
    };

    reader.onload = (evt) => {
      setUploadProgress(100);
      setUploadStatus("Parsing and processing data (this may take a moment)...");
      
      // Use setTimeout to allow UI to re-render before blocking the main thread
      setTimeout(async () => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const jsonData = XLSX.utils.sheet_to_json(ws);
          setData(jsonData);
          setChatHistory([]);
          
          setUploadStatus("Generating AI suggestions...");
          await fetchSuggestions(jsonData);
          
          setUploadProgress(null);
          setUploadStatus("");
        } catch (error) {
          console.error(error);
          setUploadStatus("Error processing file.");
          setTimeout(() => {
            setUploadProgress(null);
            setUploadStatus("");
          }, 3000);
        }
      }, 50);
    };
    
    reader.readAsBinaryString(file);
  };

  const handleSend = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;
    setIsProcessing(true);
    try {
      const result = await processQuery(q, data);
      setChatHistory(prev => [...prev, { query: q, aiData: result }]);
      setQuery("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearData = () => {
    setData([]);
    setChatHistory([]);
    setSuggestions([]);
    setQuery("");
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Lumina_BI_Report.pdf");
  };

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased pb-20 md:pb-0 min-h-screen">
      {/* TopAppBar */}
      <header className="docked full-width top-0 bg-surface text-primary border-b border-outline-variant transition-colors duration-200 ease-in-out flex justify-between items-center w-full px-4 h-16 sticky z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
            U
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary">Lumina Intelligence</span>
        </div>
        <div className="flex items-center gap-3">
          {data.length === 0 ? (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors text-label-md font-label-md"
            >
              <Upload size={16} />
              Upload Data
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleExportPDF}
                disabled={chatHistory.length === 0}
                className="flex items-center gap-2 bg-surface-container text-primary px-3 py-1.5 rounded-full hover:bg-surface-container-high transition-colors text-label-md font-label-md disabled:opacity-50 border border-outline-variant"
              >
                <FileDown size={16} />
                Export PDF
              </button>
              <button 
                onClick={handleClearData}
                className="flex items-center gap-2 bg-error-container text-on-error-container px-3 py-1.5 rounded-full hover:bg-error hover:text-on-error transition-colors text-label-md font-label-md border border-outline-variant"
              >
                <Trash2 size={16} />
                Clear Data
              </button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
          />
        </div>
      </header>

      <main className="p-margin-mobile md:p-margin-desktop space-y-lg max-w-[1440px] mx-auto mt-6">
        
        {/* Ask AI Query Bar */}
        <section className="sticky top-[80px] z-30 bg-background pb-4 pt-2">
          <div className="relative w-full rounded-full bg-surface-container-lowest border border-outline-variant shadow-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-fixed transition-all duration-300 flex items-center p-2 pl-4">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            <input 
              className="w-full bg-transparent border-none focus:outline-none text-body-lg text-on-surface ml-3 placeholder-on-surface-variant" 
              placeholder={data.length === 0 ? "Upload data first to ask questions..." : "Ask Lumina anything about your data..."} 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={data.length === 0 || isProcessing}
            />
            <button 
              onClick={() => handleSend()}
              disabled={data.length === 0 || isProcessing}
              className="bg-primary text-on-primary rounded-full p-2.5 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm ml-2 flex items-center justify-center disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">send</span>
              )}
            </button>
          </div>
          
          {/* AI Suggestions */}
          {suggestions.length > 0 && chatHistory.length === 0 && (
            <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-label-md text-on-surface-variant flex items-center mr-2">Suggested:</span>
              {suggestions.map((sug, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(sug)}
                  disabled={isProcessing}
                  className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-3 py-1.5 rounded-full text-label-sm hover:bg-surface-container hover:text-primary transition-colors disabled:opacity-50"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Dynamic Report Canvas */}
        <div ref={reportRef} className="space-y-xl bg-background pb-12">
          {chatHistory.length > 0 ? (
            chatHistory.map((chat, idx) => (
              <section key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-start mb-md border-b border-outline-variant pb-4">
                  <div>
                    <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Your Question</h4>
                    <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">psychology</span>
                      {chat.query}
                    </h2>
                  </div>
                  <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1">
                     <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                     Lumina AI
                  </div>
                </div>
                {chat.aiData?.uiSchema && (
                  <div className="mt-6">
                    <GenerativeUI schema={chat.aiData.uiSchema} data={data} />
                  </div>
                )}
              </section>
            ))
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
                  {uploadProgress !== null ? (
                    <div className="w-full h-48 bg-surface-container rounded-lg border border-outline-variant flex flex-col justify-center items-center text-on-surface p-6">
                      <span className="material-symbols-outlined text-[48px] text-primary animate-pulse mb-4">cloud_upload</span>
                      <h3 className="font-title-md font-bold text-center">{uploadStatus}</h3>
                      <div className="w-full max-w-md bg-surface-container-high rounded-full h-3 mt-4 overflow-hidden border border-outline-variant">
                        <div 
                          className="bg-primary h-3 rounded-full transition-all duration-300 ease-out" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="font-label-sm text-on-surface-variant mt-2 text-center">
                        {uploadProgress < 100 ? `${uploadProgress}% uploaded` : "Please wait..."}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-surface-container rounded-lg border border-outline-variant border-dashed flex flex-col justify-center items-center text-on-surface-variant">
                      <Upload size={32} className="mb-2 opacity-50" />
                      <p>Awaiting dataset for Generative UI analysis...</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
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
