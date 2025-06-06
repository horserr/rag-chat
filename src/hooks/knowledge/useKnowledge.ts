import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KnowledgeService, TokenService } from "../../services";
import type {
  CreateSourceDto,
  UpdateSourceDto,
  ResourceDto,
  AddFileFromUrlDto
} from "../../models/knowledge";

/**
 * Hook for fetching sources list with pagination
 */
export const useSourcesList = (page: number = 0, pageSize: number = 20) => {
  const token = TokenService.getToken();

  return useQuery({
    queryKey: ["sources", token, page, pageSize],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const knowledgeService = new KnowledgeService(token);
      return await knowledgeService.getSources(page, pageSize);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};

/**
 * Hook for creating a new source
 */
export const useCreateSource = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  return useMutation({
    mutationFn: async (sourceData: CreateSourceDto) => {
      if (!token) throw new Error("No token");
      const knowledgeService = new KnowledgeService(token);
      return await knowledgeService.createSource(sourceData);
    },
    onSuccess: () => {
      // Invalidate sources list to refresh data
      const token = TokenService.getToken();
      queryClient.invalidateQueries({ queryKey: ["sources", token] });
    },
  });
};

/**
 * Hook for updating an existing source
 */
export const useUpdateSource = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  return useMutation({
    mutationFn: async ({
      sourceId,
      sourceData
    }: {
      sourceId: number;
      sourceData: UpdateSourceDto
    }) => {
      if (!token) throw new Error("No token");
      const knowledgeService = new KnowledgeService(token);
      return await knowledgeService.updateSource(sourceId, sourceData);
    },
    onSuccess: () => {
      // Invalidate sources list to refresh data
      const token = TokenService.getToken();
      queryClient.invalidateQueries({ queryKey: ["sources", token] });
    },
  });
};

/**
 * Hook for deleting a source
 */
export const useDeleteSource = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  return useMutation({
    mutationFn: async (sourceId: number) => {
      if (!token) throw new Error("No token");
      const knowledgeService = new KnowledgeService(token);
      return await knowledgeService.deleteSource(sourceId);
    },
    onSuccess: () => {
      // Invalidate sources list to refresh data
      const token = TokenService.getToken();
      queryClient.invalidateQueries({ queryKey: ["sources", token] });
    },
  });
};

/**
 * Hook for fetching resource content
 */
export const useResource = (sourceId: number | null) => {
  const token = TokenService.getToken();

  return useQuery({
    queryKey: ["resource", sourceId, token],
    queryFn: async () => {
      if (!token || !sourceId) throw new Error("No token or source ID");
      const knowledgeService = new KnowledgeService(token);
      return await knowledgeService.getResource(sourceId);
    },
    enabled: !!token && !!sourceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Enable refetch on mount for source changes
    retry: 1,
  });
};

/**
 * Hook for updating resource content
 */
export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  return useMutation({
    mutationFn: async ({
      sourceId,
      resourceData
    }: {
      sourceId: number;
      resourceData: ResourceDto
    }) => {
      if (!token) throw new Error("No token");
      const knowledgeService = new KnowledgeService(token);
      return await knowledgeService.updateResource(sourceId, resourceData);
    },
    onSuccess: (_, { sourceId }) => {
      // Invalidate resource cache to refresh data
      const token = TokenService.getToken();
      queryClient.invalidateQueries({ queryKey: ["resource", sourceId, token] });
    },
  });
};

/**
 * Hook for fetching source files
 */
export const useSourceFiles = (sourceId: number | null) => {
  const token = TokenService.getToken();

  return useQuery({
    queryKey: ["sourceFiles", sourceId, token],
    queryFn: async () => {
      if (!token || !sourceId) throw new Error("No token or source ID");
      const knowledgeService = new KnowledgeService(token);
      return await knowledgeService.getFiles(sourceId);
    },
    enabled: !!token && !!sourceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};

/**
 * Hook for adding file from URL
 */
export const useAddFileFromUrl = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  return useMutation({
    mutationFn: async ({
      sourceId,
      fileData
    }: {
      sourceId: number;
      fileData: AddFileFromUrlDto
    }) => {
      if (!token) throw new Error("No token");
      const knowledgeService = new KnowledgeService(token);
      return await knowledgeService.addFileFromUrl(sourceId, fileData);
    },
    onSuccess: (_, { sourceId }) => {
      // Invalidate files cache to refresh data
      const token = TokenService.getToken();
      queryClient.invalidateQueries({ queryKey: ["sourceFiles", sourceId, token] });
    },
  });
};

/**
 * Hook for deleting a file
 */
export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  const token = TokenService.getToken();

  return useMutation({
    mutationFn: async ({
      sourceId,
      fileId
    }: {
      sourceId: number;
      fileId: string
    }) => {
      if (!token) throw new Error("No token");
      const knowledgeService = new KnowledgeService(token);
      return await knowledgeService.deleteFile(sourceId, fileId);
    },
    onSuccess: (_, { sourceId }) => {
      // Invalidate files cache to refresh data
      const token = TokenService.getToken();
      queryClient.invalidateQueries({ queryKey: ["sourceFiles", sourceId, token] });
    },
  });
};
