import HttpService from "@/utils/HttpService";

export function getMapById(id) {
  return HttpService({
    url: `/maps/${id}`,
    method: "get",
  });
}



