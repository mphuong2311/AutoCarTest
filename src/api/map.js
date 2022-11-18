import HttpService from "@/utils/HttpService";

export function getMapById(id) {
  return HttpService({
    url: `/maps/${id}`,
    method: "get",
  });
}

export function sendInfoToServer(id, data) {
  return HttpService({
    url: `/orders/${id}`,
    method: "patch",
    data
  });
}

