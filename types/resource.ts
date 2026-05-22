export type ResourceCategory =
  | "guide"
  | "checklist"
  | "template"
  | "report"
  | "toolkit"
  | "workbook";

export type ResourceFileType = "pdf" | "docx" | "xlsx" | "pptx" | "zip";

export interface Resource {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: ResourceFileType;
  category: ResourceCategory;
  tags: string[];
  downloads: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResourceListItem
  extends Pick<
    Resource,
    "id" | "title" | "description" | "file_type" | "category" | "tags" | "downloads" | "featured"
  > {}
