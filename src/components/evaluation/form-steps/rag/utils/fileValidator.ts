import { DATASET_VALIDATION } from "../../../../../models/evaluation-form";
import type { EvaluationType } from "../../../../../models/rag-evaluation";

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  samples?: Record<string, unknown>[];
}

export const validateFile = async (
  file: File,
  evaluationType: EvaluationType
): Promise<FileValidationResult> => {
  try {
    // Check file size
    if (file.size > DATASET_VALIDATION.maxSize) {
      return {
        isValid: false,
        error: `文件大小超过限制 (${DATASET_VALIDATION.maxSize / (1024 * 1024)}MB)`,
      };
    }

    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (
      !DATASET_VALIDATION.allowedTypes.includes(
        fileExtension as ".json" | ".jsonl" | ".csv"
      )
    ) {
      return {
        isValid: false,
        error: `不支持的文件类型，支持: ${DATASET_VALIDATION.allowedTypes.join(", ")}`,
      };
    }

    // Parse and validate content
    const content = await file.text();
    const samples = await parseFileContent(content, fileExtension);

    // Validate required fields
    const requiredFields = DATASET_VALIDATION.requiredFields[evaluationType];
    const missingFields = requiredFields.filter(
      (field) => !samples[0] || !(field in samples[0])
    );

    if (missingFields.length > 0) {
      return {
        isValid: false,
        error: `缺少必需字段: ${missingFields.join(", ")}`,
      };
    }

    return {
      isValid: true,
      samples,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "文件验证失败",
    };
  }
};

const parseFileContent = async (
  content: string,
  fileExtension: string
): Promise<Record<string, unknown>[]> => {
  let samples: Record<string, unknown>[] = [];

  if (fileExtension === ".json") {
    try {
      const data = JSON.parse(content);
      samples = Array.isArray(data) ? data : [data];
    } catch {
      // Try to handle comma-separated JSON objects (invalid JSON but common mistake)
      try {
        const wrappedContent = `[${content}]`;
        const data = JSON.parse(wrappedContent);
        samples = Array.isArray(data) ? data : [data];
      } catch {
        // If still fails, try parsing as JSONL-like format (objects separated by commas)
        const objectStrings = content
          .split(/},\s*{/)
          .map((str, index, arr) => {
            if (index === 0 && !str.startsWith("{")) str = "{" + str;
            if (index === arr.length - 1 && !str.endsWith("}"))
              str = str + "}";
            if (index > 0 && index < arr.length - 1)
              str = "{" + str + "}";
            return str;
          });
        samples = objectStrings
          .filter((str) => str.trim())
          .map((str) => JSON.parse(str));
      }
    }
  } else if (fileExtension === ".jsonl") {
    samples = content
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));
  } else if (fileExtension === ".csv") {
    // Basic CSV parsing - in production, use a proper CSV parser
    const lines = content.split("\n");
    const headers = lines[0].split(",");
    samples = lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",");
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() || "";
          return obj;
        }, {} as Record<string, unknown>);
      });
  }

  return samples;
};
