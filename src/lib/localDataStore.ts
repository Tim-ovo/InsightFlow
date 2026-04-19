import { get, set, del, keys } from 'idb-keyval';

export interface LocalDataset {
  id: string;
  name: string;
  filename: string;
  uploadedAt: number;
  rowCount: number;
  colCount: number;
  columns: string[];
  previewData: any[];
  rawData: string;
}

const STORE_PREFIX = 'insightflow_dataset_';

export const saveDataset = async (dataset: LocalDataset): Promise<void> => {
  await set(`${STORE_PREFIX}${dataset.id}`, dataset);
};

export const deleteDataset = async (id: string): Promise<void> => {
  await del(`${STORE_PREFIX}${id}`);
};

export const getDataset = async (id: string): Promise<LocalDataset | undefined> => {
  return await get(`${STORE_PREFIX}${id}`);
};

export const getAllDatasets = async (): Promise<LocalDataset[]> => {
  const allKeys = await keys();
  const datasetKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith(STORE_PREFIX));
  
  const datasets: LocalDataset[] = [];
  for (const key of datasetKeys) {
    const ds = await get(key as string);
    if (ds) datasets.push(ds as LocalDataset);
  }
  
  // Sort by date descending
  return datasets.sort((a, b) => b.uploadedAt - a.uploadedAt);
};
