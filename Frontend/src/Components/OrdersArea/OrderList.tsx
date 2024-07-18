import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderModel } from "../../Models/OrderModel";
import { ordersService } from "../../Services/OrdersService";
import { useCurrentUser } from "../../Utils/CurrentUser";
import { notify } from "../../Utils/Notify";
import { useTitle } from "../../hooks/useTitle";
import { ProductDetailsCarousel } from "../Common/ImageCarousels/ProductDetailsCarousel";

export default function OrderList(): JSX.Element {
  useTitle("My Orders");
  const { user } = useCurrentUser();
  const [orders, setOrders] = useState<OrderModel[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    ordersService
      .getOrders(user?._id)
      .then((orders) => setOrders(orders))
      .catch((err: any) => notify.error(err));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto sm:px-4 lg:px-8">
          <div className="max-w-2xl mx-auto px-4 lg:max-w-4xl lg:px-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {user?.firstName}'s Orders ({orders?.length})
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Check the status of recent orders, manage returns, and discover
              similar products.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="sr-only">Recent orders</h2>
          <div className="max-w-7xl mx-auto sm:px-4 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8 px-4 lg:max-w-4xl lg:px-0">
              {orders?.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200"
                >
                  <div className="flex items-center justify-evenly w-full p-4 sm:p-6 border-b border-gray-200">
                    <dl className="grid grid-cols-2 gap-x-6 text-sm sm:grid-cols-3 lg:col-span-2">
                      <div className="mb-4 sm:mb-0">
                        <dt className="font-medium text-gray-700">Order ID</dt>
                        <dd className="mt-1 text-gray-900">{order._id}</dd>
                      </div>
                      <div className="hidden sm:block">
                        <dt className="font-medium text-gray-700">
                          Date placed
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {format(
                            new Date(order.orderDate),
                            "MMMM dd, yyyy hh:mm a"
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-700">
                          Total amount
                        </dt>
                        <dd className="mt-1 font-medium text-gray-900">
                          {order.total}₪
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Products */}
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item.productId} className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                            <ProductDetailsCarousel
                              imageUrls={item.imageUrls}
                            />
                          </div>
                          <div className="ml-6 flex-1 text-sm">
                            <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                              <h5>{item.name}</h5>
                              <div className="mt-2 sm:mt-0">
                                {item.stock.map((s, index) => (
                                  <span
                                    key={index}
                                    className="mr-2 text-gray-700"
                                  >
                                    {s.color}, {s.size}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-2 sm:mt-0 font-medium text-gray-900">
                                {item.stock.reduce((acc, currentItem) => {
                                  const itemValue =
                                    currentItem.quantity * item.price;
                                  return acc + itemValue;
                                }, 0)}
                                ₪
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between sm:justify-start">
                          <div className="mt-4 sm:mt-0">
                            <button
                              onClick={() =>
                                navigate(`/products/details/${item.productId}`)
                              }
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              View Product
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-center">
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-500"
                      aria-hidden="true"
                    />
                    <div className="ml-2 text-sm font-medium text-gray-700">
                      Should be Delivered till{" "}
                      {format(
                        new Date(order.expectedDeliveryDate),
                        "MMMM dd, yyyy hh:mm a"
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
