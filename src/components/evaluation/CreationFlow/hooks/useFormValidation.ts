import { useCallback } from "react";
import type { RagFormData, PromptFormData } from "../../../../models/evaluation-form";

export const useFormValidation = (
  evaluationType: "rag" | "prompt",
  formData: RagFormData | PromptFormData
) => {
  const validateStep = useCallback((activeStep: number) => {
    const newErrors: Record<string, string> = {};

    if (evaluationType === "rag") {
      const ragData = formData as RagFormData;

      switch (activeStep) {
        case 0: // Configuration
          if (!ragData.taskName.trim()) {
            newErrors.taskName = "请输入任务名称";
          }
          if (!ragData.description.trim()) {
            newErrors.description = "请输入任务描述";
          }
          if (!ragData.evaluationType) {
            newErrors.evaluationType = "请选择评估类型";
          }
          if (ragData.evaluationType === "single_turn" && !ragData.metricId) {
            newErrors.metricId = "请选择评估指标";
          }
          if (
            (ragData.evaluationType === "custom" ||
              ragData.evaluationType === "multi_turn") &&
            !ragData.customMetric?.trim()
          ) {
            newErrors.customMetric = "请输入自定义评估指标";
          }
          break;

        case 1: // Dataset Upload
          if (!ragData.datasetFile) {
            newErrors.datasetFile = "请上传数据集文件";
          }
          if (!ragData.samples || ragData.samples.length === 0) {
            newErrors.samples = "数据集中没有有效的样本";
          }
          break;
      }
    } else {
      const promptData = formData as PromptFormData;

      switch (activeStep) {
        case 0: // Configuration
          if (!promptData.taskName.trim()) {
            newErrors.taskName = "请输入任务名称";
          }
          if (!promptData.prompt.trim()) {
            newErrors.prompt = "请输入提示词";
          }
          break;
      }
    }

    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  }, [evaluationType, formData]);

  return { validateStep };
};
