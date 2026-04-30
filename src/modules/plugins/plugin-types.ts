export interface Plugin {
  id: string;
  slug: string;
  name: string;
  status?: string;
  category: string;
  description: string;
  longDescription: string;
  price: string;
  duration: number;
  audioUrl: string;
  format: string;
  version: string;
  fileSize: string;
  compatibility: string;
  features: string[];
  includedItems: string[];
  systemRequirements: {
    os: string[];
    cpu: string;
    ram: string;
    storage: string;
  };
  licenseText: string;
  macDownloadUrl: string;
  windowsDownloadUrl: string;
}
