import type { AxiosInstance } from "axios";
import { rag_http } from "../api";
import type {
  SourceDto,
  CreateSourceDto,
  UpdateSourceDto,
  ResourceDto,
  FileDto,
  AddFileFromUrlDto,
} from "../../models/knowledge";
import type { Result, PaginatedResult } from "../../models/result";

/**
 * Knowledge Service
 * Handles all knowledge base related API operations
 */
export class KnowledgeService {
  private http: AxiosInstance;

  constructor(token: string) {
    this.http = rag_http(token);
  }

  /**
   * Get all sources with pagination
   */
  async getSources(
    page: number = 0,
    pageSize: number = 20
  ): Promise<PaginatedResult<SourceDto[]>> {
    try {
      const response = await this.http.get("source", {
        params: {
          page,
          page_size: pageSize,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch sources");
    }
  }

  /**
   * Create a new source
   */
  async createSource(sourceData: CreateSourceDto): Promise<Result<SourceDto>> {
    try {
      const response = await this.http.post("source", sourceData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create source");
    }
  }

  /**
   * Update an existing source
   */
  async updateSource(
    sourceId: number,
    sourceData: UpdateSourceDto
  ): Promise<Result<SourceDto>> {
    try {
      const response = await this.http.put(`source/${sourceId}`, sourceData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to update source");
    }
  }

  /**
   * Delete a source
   */
  async deleteSource(sourceId: number): Promise<Result<unknown>> {
    try {
      const response = await this.http.delete(`source/${sourceId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to delete source");
    }
  }

  /**
   * Get resource content for a source
   */
  async getResource(sourceId: number): Promise<ResourceDto> {
    try {
      const response = await this.http.get(`source/${sourceId}/resource`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch resource");
    }
  }

  /**
   * Update resource content for a source
   */
  async updateResource(
    sourceId: number,
    resourceData: ResourceDto
  ): Promise<Result<unknown>> {
    try {
      const response = await this.http.put(
        `source/${sourceId}/resource`,
        resourceData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to update resource");
    }
  }

  /**
   * Get files for a source
   */
  async getFiles(sourceId: number): Promise<FileDto[]> {
    try {
      const response = await this.http.get(`source/${sourceId}/files`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch files");
    }
  }

  /**
   * Add file from URL to source
   */
  async addFileFromUrl(
    sourceId: number,
    fileData: AddFileFromUrlDto
  ): Promise<Result<unknown>> {
    try {
      const response = await this.http.post(
        `source/${sourceId}/files/url`,
        fileData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to add file from URL");
    }
  }

  /**
   * Delete a file from source
   */
  async deleteFile(sourceId: number, fileId: string): Promise<Result<unknown>> {
    try {
      const response = await this.http.delete(
        `source/${sourceId}/files/${fileId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to delete file");
    }
  }

  /**
   * Download a file from source
   */
  async downloadFile(sourceId: number, fileId: string): Promise<Blob> {
    try {
      const response = await this.http.get(
        `source/${sourceId}/files/${fileId}/download`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to download file");
    }
  }  /**
   * Handle API errors
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error: any, defaultMessage: string): Error {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message =
      error?.response?.data?.message || error?.message || defaultMessage;
    return new Error(message);
  }
}
