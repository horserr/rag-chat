/**
 * Knowledge base data structures
 * Based on the API definitions from knowledge.http
 */

export interface SourceDto {
  id: number;
  created_by: number;
  created_at: string;
  posted_at: string | null;
  posted_by: string;
  title: string;
  accessible_by: number[];
  diagram: string | null;
}

export interface CreateSourceDto {
  created_by: number;
  posted_by: string;
  title: string;
  accessible_by: number[];
}

export interface UpdateSourceDto {
  id: number;
  created_by: number;
  created_at: string;
  posted_at: string | null;
  posted_by: string;
  title: string;
  accessible_by: number[];
}

export interface ResourceDto {
  text: string;
}

export interface FileDto {
  id: string;
  attachment_name: string | null;
  content_type: string;
  url?: string;
  created_at: string;
  size?: number;
}

export interface AddFileFromUrlDto {
  attachment_name: string | null;
  content_type: string;
  url: string;
}

// Knowledge base upload file structure
export interface KnowledgeFileUpload {
  source: CreateSourceDto | UpdateSourceDto;
  resource: ResourceDto;
  files?: AddFileFromUrlDto[];
}

// For display in the UI
export interface KnowledgeSource extends SourceDto {
  resourceText?: string;
  files?: FileDto[];
}
