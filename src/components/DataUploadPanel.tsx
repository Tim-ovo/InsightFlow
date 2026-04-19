import React, { useRef, useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Upload, Database, FileSpreadsheet, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { saveDataset, getAllDatasets, deleteDataset, LocalDataset } from '../lib/localDataStore';

interface Props {
  onDatasetSelect: (dataset: LocalDataset | null) => void;
  activeDatasetId: string | null;
}

export function DataUploadPanel({ onDatasetSelect, activeDatasetId }: Props) {
  const [datasets, setDatasets] = useState<LocalDataset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDatasets = async () => {
    const data = await getAllDatasets();
    setDatasets(data);
    
    // Auto-select if active is missing
    if (!activeDatasetId && data.length > 0) {
      onDatasetSelect(data[0]);
    } else if (data.length === 0) {
      onDatasetSelect(null);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, [activeDatasetId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          if (results.errors.length > 0 && results.data.length === 0) {
            setError(`解析 CSV 失败: ${results.errors[0].message}`);
            setIsUploading(false);
            return;
          }

          const rawDataString = Papa.unparse(results.data);
          const columns = results.meta.fields || [];
          const rowCount = results.data.length;
          const name = file.name.replace(/\.[^/.]+$/, ""); // remove extension

          const newDataset: LocalDataset = {
            id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
            name,
            filename: file.name,
            uploadedAt: Date.now(),
            rowCount,
            colCount: columns.length,
            columns,
            previewData: results.data.slice(0, 5),
            rawData: rawDataString,
          };

          await saveDataset(newDataset);
          await loadDatasets();
          onDatasetSelect(newDataset);
        } catch (err: any) {
          setError(err.message || '保存数据集时出错');
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
      error: (err) => {
        setError(`读取文件失败: ${err.message}`);
        setIsUploading(false);
      }
    });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteDataset(id);
    if (activeDatasetId === id) {
      onDatasetSelect(null);
    }
    await loadDatasets();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          本地数据集管理
        </h3>
        
        <div>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? '解析中...' : '上传 CSV'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-lg flex items-start gap-2 text-sm border border-rose-100">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {datasets.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <FileSpreadsheet className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">暂无本地数据集，当前默认使用内置 Mock 数据<br />上传您的 CSV 开启专属分析，数据仅保存在本地浏览器</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((ds) => {
            const isActive = ds.id === activeDatasetId;
            return (
              <div 
                key={ds.id}
                onClick={() => onDatasetSelect(ds)}
                className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'border-indigo-500 bg-indigo-50/30' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 overflow-hidden pr-6">
                    <FileSpreadsheet className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <h4 className="font-medium text-gray-900 truncate" title={ds.name}>{ds.name}</h4>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, ds.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100">{ds.rowCount.toLocaleString()} 行</span>
                  <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100">{ds.colCount} 列</span>
                  <span title={new Date(ds.uploadedAt).toLocaleString()}>{new Date(ds.uploadedAt).toLocaleDateString()}</span>
                </div>
                
                <p className="text-xs text-gray-400 truncate mt-2 border-t border-gray-100 pt-2" title={ds.columns.join(', ')}>
                  字段: {ds.columns.join(', ')}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
