// filepath: i:\Web\rag-chat\src\components\evaluation\form-steps\rag\RagDatasetStep.tsx
import React, { useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import type { RagFormData } from "../../../../models/evaluation-form";
import FileUploadZone from "./components/FileUploadZone";
import FileInfoDisplay from "./components/FileInfoDisplay";
import DataPreview from "./components/DataPreview";
import RequiredFieldsHelp from "./components/RequiredFieldsHelp";
import { validateFile } from "./utils/fileValidator";

interface RagDatasetStepProps {
  formData: RagFormData;
  onFormChange: (field: keyof RagFormData, value: unknown) => void;
}

const RagDatasetStep: React.FC<RagDatasetStepProps> = ({
  formData,
  onFormChange,
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<
    Record<string, unknown>[] | null
  >(null);

  const handleFileValidation = useCallback(
    async (file: File) => {
      if (!formData.evaluationType) return;

      setIsValidating(true);
      setValidationError(null);

      const result = await validateFile(file, formData.evaluationType);

      if (result.isValid && result.samples) {
        setPreviewData(result.samples.slice(0, 5));
        onFormChange("datasetFile", file);
        onFormChange("samples", result.samples);
      } else {
        setValidationError(result.error || "文件验证失败");
        setPreviewData(null);
      }

      setIsValidating(false);
    },
    [formData.evaluationType, onFormChange]
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileValidation(file);
      }
    },
    [handleFileValidation]
  );

  const handleRemoveFile = useCallback(() => {
    onFormChange("datasetFile", undefined);
    onFormChange("samples", undefined);
    setPreviewData(null);
    setValidationError(null);
  }, [onFormChange]);

  return (
    <Box sx={{ pt: 2, pb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        数据集上传
      </Typography>

      {formData.evaluationType && (
        <RequiredFieldsHelp evaluationType={formData.evaluationType} />
      )}

      {!formData.datasetFile ? (
        <FileUploadZone onFileUpload={handleFileUpload} />
      ) : (
        <>
          <FileInfoDisplay
            file={formData.datasetFile}
            samplesCount={formData.samples?.length}
            isValidating={isValidating}
            validationError={validationError}
            onRemoveFile={handleRemoveFile}
          />
          {previewData && <DataPreview previewData={previewData} />}
        </>
      )}
    </Box>
  );
};

export default RagDatasetStep;
