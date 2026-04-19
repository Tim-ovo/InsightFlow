import { overviewData, channelData, userData, productData } from '../data/mockData';

export interface LocalDatasetInfo {
  id: string;
  name: string;
  columns: string[];
  rowCount: number;
  colCount: number;
  previewData: any[];
}

export type AgentType = 'Planner' | 'Metric' | 'Data' | 'Diagnosis' | 'Insight' | 'Report';

export interface AnalysisContext {
  question: string;
  plan?: string;
  metrics?: string[];
  dataKeys?: string[];
  diagnosis?: any;
  insights?: string[];
  report?: any;
  activeDataset?: LocalDatasetInfo | null;
}

export const executeAgent = async (
  agentType: AgentType,
  context: AnalysisContext,
  onProgress: (status: string) => void
): Promise<AnalysisContext> => {
  // Simulate AI latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowercaseQ = context.question.toLowerCase();

  if (context.activeDataset) {
    const ds = context.activeDataset;
    switch (agentType) {
      case 'Planner':
        onProgress(`分析自定义数据集 [${ds.name}] 的结构...`);
        context.plan = `目标：针对本地数据集 [${ds.name}] 探索并解答用户问题：“${context.question}”。路径：1.解析字段集合 -> 2.匹配自然语言意图 -> 3.返回数据概览与初步诊断。`;
        break;
      case 'Metric':
        onProgress('匹配相关字段...');
        context.metrics = ds.columns.slice(0, 3);
        break;
      case 'Data':
        onProgress(`提取并装载 ${ds.name} 数据 (共 ${ds.rowCount} 行)...`);
        context.dataKeys = [ds.name];
        break;
      case 'Diagnosis':
        onProgress('尝试进行本地特征抽取...');
        context.diagnosis = {
          structure: `共 ${ds.rowCount} 行, ${ds.colCount} 列`,
          fields: `包含字段: ${ds.columns.slice(0, 5).join(', ')}${ds.columns.length > 5 ? ' 等' : ''}`,
          fallbackInfo: '已完成基础结构扫描。因离线模式且结构未知，暂未下钻深层异常原因。'
        };
        break;
      case 'Insight':
        onProgress('生成自定义数据响应摘要...');
        context.insights = [
          `数据集 ${ds.name} 已成功加载。`,
          `基于目前提供的非结构化字段，系统将优雅降载为基础信息摘要模式。如果需要复杂归因，请通过大模型 API 连接真实 Agent 对话。`
        ];
        break;
      case 'Report':
        onProgress('生成本地数据诊断报告...');
        context.report = {
          summary: `已基于您上传的本地数据集 [${ds.name}] 进行上下文绑定。由于本地模式无通用 LLM 分析能力，已为您完成数据抽取验证和意图匹配。您问的是：${context.question}`,
          recommendations: [
            { level: '高', text: '确认本地数据字段完整无误后，考虑增加更多的强特征列。' },
            { level: '中', text: '尝试对数值型字段进行标准化处理。' },
            { level: '低', text: '接入大模型继续深化归因能力。' }
          ],
          confidence: '70%'
        };
        break;
    }
    return context;
  }

  switch (agentType) {
    case 'Planner':
      onProgress('规划分析路径...');
      if (context.question.includes('支付转化率下降')) {
        context.plan = '目标：分析支付转化率下降原因。路径：1.确认大盘跌幅 -> 2.根据渠道和新老客拆解 -> 3.定位核心拖累因子。';
      } else if (context.question.includes('GMV') && context.question.includes('利润下降')) {
        context.plan = '目标：分析量增利减原因。路径：1.大盘GMV与利润趋势拆解 -> 2.商品结构利润率分析 -> 3.找出高促低毛利来源。';
      } else if (context.question.includes('渠道') && context.question.includes('预算')) {
        context.plan = '目标：评估渠道预算分配。路径：1.各渠道ROI对比 -> 2.流量规模与转化分析 -> 3.给出最优ROI的留存策略建议。';
      } else {
        context.plan = '无法精确识别业务意图，将进行通用概览分析。';
      }
      break;

    case 'Metric':
      onProgress('识别关键指标...');
      if (context.question.includes('支付转化率下降')) {
        context.metrics = ['支付转化率(pay/uv)', 'UV', 'Pay', '渠道贡献'];
      } else if (context.question.includes('GMV') && context.question.includes('利润下降')) {
        context.metrics = ['GMV', 'Profit', '利润率(Profit/GMV)', '商品退款率'];
      } else if (context.question.includes('渠道') && context.question.includes('预算')) {
        context.metrics = ['渠道ROI(Profit/Cost)', '客单价', '转化率'];
      } else {
        context.metrics = ['GMV', 'UV', 'Profit'];
      }
      break;

    case 'Data':
      onProgress('加载与清洗数据 (SQL / CSV)...');
      if (context.question.includes('支付转化率下降')) {
        context.dataKeys = ['overviewData', 'channelData', 'userData'];
      } else if (context.question.includes('GMV') && context.question.includes('利润下降')) {
        context.dataKeys = ['overviewData', 'productData'];
      } else if (context.question.includes('渠道') && context.question.includes('预算')) {
        context.dataKeys = ['channelData'];
      } else {
        context.dataKeys = ['overviewData'];
      }
      break;

    case 'Diagnosis':
      onProgress('多维归因计算中...');
      if (context.question.includes('支付转化率下降')) {
        context.diagnosis = {
          overallDrop: '支付转化率从 6.6% 降至 5.25%',
          channelFactor: 'short_video 渠道转化率仅为 1.8%（大盘拖累 -2.1%）',
          userFactor: '新客转化率跌至 2.3%，且流量比重增加'
        };
      } else if (context.question.includes('GMV') && context.question.includes('利润下降')) {
        context.diagnosis = {
          anomaly: 'GMV 增加 18%，但利润下降 7.5%',
          productFactor: 'low_margin_electronics 品类 GMV 占比增加，但带来25%的高退款率，侵蚀利润',
          marginDrop: '整体毛利率自 68% 降至 45% (受大促补贴及退款影响)'
        };
      } else if (context.question.includes('渠道') && context.question.includes('预算')) {
        context.diagnosis = {
          bestROI: 'search 渠道 ROI 高达 5.5，且转化率稳定在 14%',
          volumeTrap: 'short_video 流量大(1.2w UV)，但 ROI 为负 (-0.59)',
          adsSteady: 'ads 渠道表现中等，ROI 2.2'
        };
      } else {
        context.diagnosis = { status: 'ok', info: '通用分析数据正常' };
      }
      break;

    case 'Insight':
      onProgress('生成业务洞察与结论...');
      if (context.question.includes('支付转化率下降')) {
        context.insights = [
          '大盘转化率下降主要由短视频带来大量低意向新客导致。',
          'Search渠道的转化率依然坚挺，说明核心用户心智稳定。'
        ];
      } else if (context.question.includes('GMV') && context.question.includes('利润下降')) {
        context.insights = [
          '表面繁荣掩盖了商品结构恶化，低毛利电子产品的大促拉低了整盘净利。',
          '高退款率导致了履约成本浪费，进一步压缩利润空间。'
        ];
      } else if (context.question.includes('渠道') && context.question.includes('预算')) {
        context.insights = [
          '搜索渠道（Search）是利润压舱石，转化质量最高。',
          '短视频虽然带量快，但目前策略导致纯亏损，不适合作为当前转化抓手。'
        ];
      } else {
        context.insights = ['目前核心业务平稳，暂时未见明显异动。'];
      }
      break;

    case 'Report':
      onProgress('输出总裁办分析报告...');
      if (context.question.includes('支付转化率下降')) {
        context.report = {
          summary: '本周支付转化率显著下降，核心原因是短视频渠道引入了大量低意向新客户，摊薄了整体转化率水平。',
          recommendations: [
            { level: '高', text: '优化短视频落地页的逼单逻辑，减少“凑热闹”流量的无效流失。' },
            { level: '中', text: '对短视频带来的新客提供限时首单补贴（例如新人专享立减），提升首单转化。' },
            { level: '高', text: '在预算分配上，暂时减少劣质短视频达人的合作，回流预算至搜索。' }
          ],
          confidence: '95%'
        };
      } else if (context.question.includes('GMV') && context.question.includes('利润下降')) {
        context.report = {
          summary: 'GMV的上升主要由低毛利的电子类产品拉动，不仅摊薄了整盘毛利率，且伴随着极高的退款率（25%），导致利润大幅净流失。',
          recommendations: [
            { level: '高', text: '立刻调整补贴策略，降低对电子类低毛利商品的绝对让利金额，采用满减凑单的方式绑定高毛利服饰商品。' },
            { level: '高', text: '排查电子类产品的品质或详情页描述，降低25%的高退款率。' },
            { level: '中', text: '将主推资源位部分回调给服饰等高毛利品类。' }
          ],
          confidence: '92%'
        };
      } else if (context.question.includes('渠道') && context.question.includes('预算')) {
        context.report = {
          summary: '搜索渠道（Search）提供了最好的转化率和ROI，应作为预算倾斜的首选；短视频流量大但转化极低且 ROI 为负。',
          recommendations: [
            { level: '高', text: '预算直接向 Search 渠道加码，吃透核心意向用户的搜索流量词包。' },
            { level: '中', text: '按效果结算机制重新与短视频渠道谈判，或转为纯品牌曝光（非带货）投放。' },
            { level: '低', text: 'Ads 保持现有平稳投放节奏即可，作为辅助增量补充。' }
          ],
          confidence: '98%'
        };
      } else {
        context.report = {
          summary: '针对您的输入，无法进行深度归因。建议您选择预设的业务场景问题进行分析。',
          recommendations: [
            { level: '低', text: '持续监控核心数据表现。' }
          ],
          confidence: '50%'
        };
      }
      break;
  }
  
  return context;
};
