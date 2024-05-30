import { toast } from "@/components/ui/use-toast";

interface FetchOptions {
  url: string;
  type?: "POST" | "GET" | "DELETE" | "PUT" | "PATCH";
  data?: { [key: string]: any };
}
export async function Fetch({ url, data, type = "GET" }: FetchOptions) {
  const options = {
    method: type,
  };

  let _url = url;

  if (type === "GET") {
    data && (_url += "?" + new URLSearchParams(data).toString());
  } else {
    _url = url;
  }

  if (type !== "GET") {
    Object.assign(options, { body: JSON.stringify(data || {}) });
  }

  return fetch(_url, options)
    .then((resp) => {
      if (resp.status !== 200) {
        toast({
          description: resp?.statusText ?? resp.status,
          variant: "destructive",
        });
      } else {
        return resp.json();
      }
    })
    .then((data) => {
      if (data?.status === 401) {
        location.href = "/login";
        return;
      }

      if (!data.success) {
        toast({ description: data.message, variant: "destructive" });
        return;
      } else {
        return data.data;
      }
    })
    .catch((error) => {
      toast({
        description: error?.message ?? "Register error.",
        variant: "destructive",
      });
      return;
    });
}
