import React, { useState } from 'react';
import { AgentFlow } from './AgentFlow';
import { TrendChart, ChannelBarChart } from './Charts';
import { executeAgent, AnalysisContext, AgentType } from '../lib/agents';
import { Search, Sparkles, TrendingUp, DollarSign, Target, AlertTriangle, ArrowRight, Lightbulb, Database, FileText } from 'lucide-react';
import { overviewData, channelData } from '../data/mockData';

const presetQuestions = [
  "为什么这周支付转化率下降了？",
  "为什么 GMV 涨了但利润下降了？",
  "哪个渠道最值得加预算？"
];

const agentsList: AgentType[] = ['Planner', 'Metric', 'Data', 'Diagnosis', 'Insight', 'Report'];

export function Dashboard() {
  const [question, setQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentType | null>(null);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState<AnalysisContext | null>(null);

  const handleAnalyze = async (q: string) => {
    if (!q) return;
    setQuestion(q);
    setIsAnalyzing(true);
    setResult(null);
    
    let context: AnalysisContext = { question: q };
    
    for (const agent of agentsList) {
      setCurrentAgent(agent);
      context = await executeAgent(agent, context, setStatusText);
    }
    
    setCurrentAgent(null);
    setResult(context);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">InsightFlow</h1>
            <p className="text-xs text-gray-500 font-medium">Autonomous Data Analyst Agent</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:block">当前模式: Rule-based Engine Fallback</span>
          <div className="h-8 w-8 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Analyst" alt="User" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Search Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">你需要分析什么业务问题？</h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isAnalyzing}
              className="block w-full pl-11 pr-32 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg transition-all"
              placeholder="例如：为什么支付转化率下降了？"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(question)}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button
                onClick={() => handleAnalyze(question)}
                disabled={isAnalyzing || !question}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAnalyzing ? '分析中...' : '开始分析'}
                {!isAnalyzing && <Sparkles className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto mt-6 flex flex-wrap items-center gap-3 justify-center">
            <span className="text-sm text-gray-500 font-medium">示例问题：</span>
            {presetQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAnalyze(q)}
                disabled={isAnalyzing}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors font-medium border border-gray-200 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </section>

        {/* Multi-Agent Flow visualization */}
        {(isAnalyzing || result) && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AgentFlow activeId={currentAgent} statusText={statusText} />
          </section>
        )}

        {/* Results Section */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            {/* Left Column: Data & Metrics (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Context Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Target className="w-5 h-5" />
                    <h4 className="font-medium text-sm">核心指标</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.metrics?.map((m, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm md:col-span-2">
                  <div className="flex items-center gap-2 text-violet-600 mb-2">
                    <Database className="w-5 h-5" />
                    <h4 className="font-medium text-sm">数据范围与切面</h4>
                  </div>
                  <div className="mt-3 flex gap-2">
                     {result.dataKeys?.map((d, i) => (
                       <div key={i} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                         <Database className="w-3 h-3 text-gray-400" />
                         {d}.csv
                       </div>
                     ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                    诊断执行计划：{result.plan}
                  </p>
                </div>
              </div>

              {/* Charts area based on question context */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">关键数据图表</h3>
                {question.includes('渠道') ? (
                  <>
                    <p className="text-sm text-gray-500 mb-2">各渠道投入与产出对比 (10月6日-7日)</p>
                    <ChannelBarChart data={channelData} />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-2">大盘核心指标趋势 (近7日)</p>
                    <TrendChart data={overviewData} />
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Report & Insights */}
            <div className="space-y-6">
              
              {/* Diagnosis Output */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-2 text-rose-600 mb-4">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-semibold text-gray-900">异常检测结果</h3>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(result.diagnosis || {}).map(([key, val], idx) => (
                      <div key={idx} className="bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                        <p className="text-sm text-rose-800 leading-relaxed"><span className="font-medium mr-2">•</span>{val as string}</p>
                      </div>
                    ))}
                  </div>
              </div>

              {/* Final Report */}
              <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  智能决策报告
                </h3>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold tracking-wider text-indigo-900 uppercase mb-2">归因总结</h4>
                  <p className="text-sm text-gray-700 leading-relaxed bg-white/60 p-4 rounded-xl border border-indigo-50">
                    {result.report?.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold tracking-wider text-indigo-900 uppercase mb-3 flex items-center justify-between">
                    <span>行动建议</span>
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      置信度 {result.report?.confidence}
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {result.report?.recommendations.map((rec: any, idx: number) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl text-sm border border-indigo-50 shadow-sm flex items-start gap-3">
                        <span className={`shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold ${
                          rec.level === '高' ? 'bg-rose-100 text-rose-700' :
                          rec.level === '中' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          P{idx + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed mt-0.5">{rec.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
