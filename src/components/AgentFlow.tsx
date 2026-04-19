import React from 'react';
import { motion } from 'motion/react';
import { Bot, LineChart, Database, Brain, Lightbulb, FileText, CheckCircle2 } from 'lucide-react';

const agentSteps = [
  { id: 'Planner', name: 'Planner Agent', icon: Bot, desc: '意图识别与规划' },
  { id: 'Metric', name: 'Metric Agent', icon: LineChart, desc: '指标与公式识别' },
  { id: 'Data', name: 'Data Agent', icon: Database, desc: '数据获取与清洗' },
  { id: 'Diagnosis', name: 'Diagnosis Agent', icon: Brain, desc: '异常检测与算子计算' },
  { id: 'Insight', name: 'Insight Agent', icon: Lightbulb, desc: '多维归因与结论生成' },
  { id: 'Report', name: 'Report Agent', icon: FileText, desc: '业务建议与报告整合' },
];

export function AgentFlow({ activeId, statusText }: { activeId: string | null, statusText?: string }) {
  const activeIndex = activeId ? agentSteps.findIndex(s => s.id === activeId) : -1;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Bot className="w-5 h-5 text-indigo-500" />
        Multi-Agent 协作网络
      </h3>
      
      <div className="flex justify-between items-start relative px-4">
        {/* Line wrapper to constrain progress bar width exactly between first and last icons */}
        <div className="absolute top-6 left-16 right-16 h-0.5 z-0">
          {/* Background connector line */}
          <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
          
          {/* Animated active line */}
          <div className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full transition-all duration-500" 
               style={{ width: `${Math.max(0, (activeIndex / (agentSteps.length - 1)) * 100)}%` }}></div>
        </div>
             
        {agentSteps.map((step, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const isDone = activeIndex === agentSteps.length;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group w-24">
              <motion.div
                animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 bg-white transition-colors duration-300
                  ${(isPast || isDone) ? 'border-indigo-500 shadow-md ring-2 ring-indigo-100' : ''}
                  ${isActive ? 'border-indigo-500 ring-4 ring-indigo-200 bg-indigo-50 text-indigo-600' : ''}
                  ${!isPast && !isActive && !isDone ? 'border-gray-200 text-gray-400' : 'text-indigo-600'}
                `}
              >
                {isPast || isDone ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
              </motion.div>
              
              <span className={`text-sm font-medium text-center ${isActive ? 'text-indigo-600' : 'text-gray-600'}`}>
                {step.name}
              </span>
              <span className="text-xs text-gray-400 text-center mt-1 hidden md:block">
                {step.desc}
              </span>
              
              {isActive && statusText && (
                <div className="absolute -bottom-10 whitespace-nowrap bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
                  {statusText}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
