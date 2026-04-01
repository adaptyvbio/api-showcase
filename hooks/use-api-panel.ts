"use client";

import { useState, useCallback } from "react";

export interface ApiPanelState {
  method: "GET" | "POST";
  endpoint: string;
  requestBody: unknown | null;
  requestHeaders: Record<string, string>;
  response: unknown | null;
  responseStatus: number | null;
  isLoading: boolean;
  activeTab: "request" | "response";
}

const DEFAULT_HEADERS = {
  Authorization: "Bearer abs0_****",
  "Content-Type": "application/json",
};

export function useApiPanel(initialMethod: "GET" | "POST" = "GET", initialEndpoint = "") {
  const [state, setState] = useState<ApiPanelState>({
    method: initialMethod,
    endpoint: initialEndpoint,
    requestBody: null,
    requestHeaders: DEFAULT_HEADERS,
    response: null,
    responseStatus: null,
    isLoading: false,
    activeTab: "request",
  });

  const setRequest = useCallback(
    (method: "GET" | "POST", endpoint: string, body?: unknown) => {
      setState((s) => ({
        ...s,
        method,
        endpoint,
        requestBody: body ?? null,
        activeTab: "request",
      }));
    },
    []
  );

  const setLoading = useCallback((loading: boolean) => {
    setState((s) => ({ ...s, isLoading: loading }));
  }, []);

  const setResponse = useCallback((response: unknown, status: number) => {
    setState((s) => ({
      ...s,
      response,
      responseStatus: status,
      isLoading: false,
      activeTab: "response",
    }));
  }, []);

  const reset = useCallback(() => {
    setState((s) => ({
      ...s,
      response: null,
      responseStatus: null,
      isLoading: false,
      activeTab: "request",
    }));
  }, []);

  return { ...state, setRequest, setLoading, setResponse, reset };
}
