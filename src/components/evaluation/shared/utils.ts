import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
  Cancel as CancelledIcon,
} from '@mui/icons-material';

/**
 * 根据评估分数返回对应的颜色
 * @param score 分数字符串或数字
 * @returns MUI颜色 - success/warning/error
 */
export const getScoreColor = (score: string | number) => {
  const numScore = typeof score === 'string' ? parseFloat(score) : score;

  if (numScore >= 4) return 'success';
  if (numScore >= 2.5) return 'warning';
  return 'error';
};

/**
 * 根据评估状态返回对应的颜色
 * @param status 评估状态
 * @returns MUI颜色 - success/warning/error/info
 */
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success':
      return 'success';
    case 'failed':
    case 'error':
      return 'error';
    case 'running':
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'info';
  }
};

/**
 * 根据评估状态返回对应的图标组件
 * @param status 评估状态
 * @returns React图标组件
 */
export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success':
      return SuccessIcon;
    case 'failed':
    case 'error':
      return ErrorIcon;
    case 'running':
    case 'pending':
      return PendingIcon;
    case 'cancelled':
      return CancelledIcon;
    default:
      return PendingIcon;
  }
};