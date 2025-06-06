// Existing components
export { default as MermaidDiagram } from './MermaidDiagram';
export { default as KnowledgeFileUploader } from './KnowledgeFileUploader';
export { default as LoadingScreen } from './LoadingScreen';

// New extracted components
export { default as KnowledgePageHeader } from './KnowledgePageHeader';
export { default as KnowledgeSourcesList } from './KnowledgeSourcesList';
export { default as ResourceContentTab } from './tabs/ResourceContentTab';
export { default as FilesTab } from './FilesTab';
export { default as KnowledgeGraphTab } from './tabs/KnowledgeGraphTab';
export { default as CreateSourceDialog } from './CreateSourceDialog';
export { default as EditSourceDialog } from './EditSourceDialog';
export { default as UploadKnowledgeDialog } from './UploadKnowledgeDialog';
export { default as FileMenu } from './FileMenu';

// New refactored components
export { default as KnowledgeLoading } from './KnowledgeLoading';
export { default as KnowledgeExplorerLayout } from '../../layouts/KnowledgeExplorerLayout';
export { default as KnowledgeSourceManager } from './KnowledgeSourceManager';
export { default as KnowledgeFileManager } from './KnowledgeFileManager';

// Explorer components
export * from './explorer';
export * from './panels';
