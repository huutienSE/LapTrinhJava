/**
 * Parse ApiResponse error from axios (4xx/5xx).
 * Validation errors: { success: false, data: { field: "message" }, message: "..." }
 */
export function parseApiError(error) {
  const body = error?.response?.data;

  if (!body) {
    return {
      formError: error?.message || null,
      fieldErrors: null,
    };
  }

  const data = body.data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const entries = Object.entries(data).filter(
      ([, value]) => typeof value === "string" && value.trim()
    );

    if (entries.length > 0) {
      const fieldErrors = Object.fromEntries(entries);
      return { fieldErrors, formError: null };
    }
  }

  return {
    fieldErrors: null,
    formError: body.message || error?.message || null,
  };
}

export function getApiErrorMessage(
  error,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại."
) {
  const { fieldErrors, formError } = parseApiError(error);
  if (formError) return formError;
  if (fieldErrors) return Object.values(fieldErrors).join(". ");
  return fallback;
}

/** Message from ApiResponse when success === false */
export function getEnvelopeError(
  response,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại."
) {
  if (response?.success) return null;
  return response?.message || fallback;
}

/** Axios errors with HTTP status + network awareness */
export function getHttpAwareErrorMessage(
  error,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại."
) {
  const status = error?.response?.status;

  if (status === 403) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }

  if (status === 401) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }

  if (!error?.response) {
    return "Không thể kết nối máy chủ. Kiểm tra mạng hoặc thử lại sau.";
  }

  return getApiErrorMessage(error, fallback);
}

export const fieldErrorClass = "text-red-400 text-sm mt-1";
