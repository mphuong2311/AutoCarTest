import HttpService from "@/utils/HttpService";

export function updateOrder(id, data) {
  return HttpService({
    url: `/orders/app/${id}`,
    method: "patch",
    data,
  });
}

export function createOrder(data) {
  return HttpService({
    url: `/orders`,
    method: "post",
    data,
  });
}

export function getOrders() {
  return HttpService({
    url: `/orders`,
    method: "get",
  });
}

export function deleteOrder(id) {
  return HttpService({
    url: `/orders/${id}`,
    method: "delete",
  });
}
