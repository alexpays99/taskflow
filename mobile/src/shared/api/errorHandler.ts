import { AxiosError } from 'axios';

export interface ApiError {
  type: 'network' | 'validation' | 'unauthorized' | 'server' | 'rateLimit' | 'unknown';
  message: string;
  errors?: Record<string, string[]>;
}

interface ValidationErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function handleApiError(error: AxiosError<unknown>): ApiError {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return {
        type: 'network',
        message: 'errors.connection_timeout',
      };
    }
    return {
      type: 'network',
      message: 'errors.no_internet_connection',
    };
  }

  const status = error.response.status;
  const data = error.response.data as ValidationErrorResponse | undefined;

  const getMessage = (): string => {
    if (!data || typeof data !== 'object') return '';
    if (Array.isArray(data.message)) return data.message[0] || '';
    return data.message?.toString() || '';
  };

  switch (status) {
    case 400:
      return {
        type: 'validation',
        message: getMessage() || 'errors.bad_request',
      };

    case 401:
    case 403:
      return {
        type: 'unauthorized',
        message: 'errors.session_expired',
      };

    case 404:
      return {
        type: 'server',
        message: 'errors.resource_not_found',
      };

    case 409:
      return {
        type: 'validation',
        message: getMessage() || 'errors.conflict',
      };

    case 422:
      return {
        type: 'validation',
        message: getMessage() || 'errors.validation_failed',
      };

    case 429:
      return {
        type: 'rateLimit',
        message: 'errors.too_many_requests',
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: 'server',
        message: 'errors.server_unavailable',
      };

    default:
      return {
        type: 'unknown',
        message: 'errors.unknown_error',
      };
  }
}
