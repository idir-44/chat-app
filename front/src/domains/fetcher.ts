type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string | FormData;
  headers?: Record<string, string>;
};

const fetcher = async (url: string, options: RequestOptions) => {
  if (!options.headers) {
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  return fetch(`${import.meta.env.VITE_API_BASE_URL}/v1${url}`, {
    ...options,
    credentials: "include",
  }).then(async (res) => {
    if (!res.ok) {
      const r = res.json();
      throw r;
    }

    if (res.status === 204) {
      return null;
    }

    return res.json();
  });
};

export default fetcher;
