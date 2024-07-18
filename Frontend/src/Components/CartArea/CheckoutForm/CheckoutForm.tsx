import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OrderModel } from "../../../Models/OrderModel";
import { AppState } from "../../../Redux/AppState";
import { ordersService } from "../../../Services/OrdersService";
import { calculateCartSubtotal } from "../../../Utils/CalculateCart";
import { extractCheckoutItems } from "../../../Utils/ExtractCheckoutItems";
import { notify } from "../../../Utils/Notify";
import { useDeliveryInfo } from "../../../hooks/CheckoutHooks/useDeliveryInfo";
import { useTitle } from "../../../hooks/useTitle";
import securityIcon from "../../Assets/Images/SecurityIcon.png";
import EmailInput from "../../Common/Inputs/EmailInput/EmailInput";
import BillingAddressInput from "./Inputs/BillingAddressInput/BillingAddressInput";
import CardDetailsInput from "./Inputs/CardDetailsInput/CardDetailsInput";
import CardHolderInput from "./Inputs/CardHolderInput/CardHolderInput";
import ShippingMethodsInputs from "./Inputs/ShippingMethodsInputs/ShippingMethodsInputs";
import { useCurrentUser } from "../../../Utils/CurrentUser";

export default function CheckoutForm(): JSX.Element {
  useTitle("Checkout");
  const methods = useForm<OrderModel>();
  const { user } = useCurrentUser();
  const { handleSubmit, register, setValue } = methods;
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("Fast-Delivery");
  const { expectedDeliveryDate, shippingPrice } = useDeliveryInfo(
    shippingMethod && shippingMethod
  );
  const navigate = useNavigate();
  const cartItems = useSelector(
    (appState: AppState) => appState.cart?.products
  );

  const cartTotal = () => {
    return calculateCartSubtotal(cartItems && cartItems);
  };

  async function order(order: OrderModel) {
    try {
      console.log(order);
      order.userId = user?._id;
      setIsProcessingOrder(true);
      const orderItems = extractCheckoutItems(Object.values(cartItems));
      order.items = orderItems;
      order.subtotal = cartTotal();
      order.total = calculateCartSubtotal(cartItems) + shippingPrice;
      order.expectedDeliveryDate = expectedDeliveryDate;
      order.shipping = shippingPrice;
      order.customer.paymentDetails.type = "credit-card";
      const addedOrder = await ordersService.addOrder(order);
      setTimeout(async () => {
        setIsProcessingOrder(false);
        notify.success(
          `Your order has been successfully placed. Thank you for shopping with us ${order.customer.name}`
        );
        navigate(`/payment-success/${addedOrder._id}`);
      }, 3000);
      console.log(order);
    } catch (err: any) {
      setIsProcessingOrder(false);
      notify.error(err);
    }
  }

  return (
    <div className="p-14 border-2 shadow-md rounded-lg bg-gray-50 ">
      <h1 className="text-center text-2xl font-thin mb-4 text-gray-700 sm:text-4xl flex items-center justify-center">
        Secure Checkout
        <span className="mt-1 ml-2 block h-6 w-6 sm:w-8 sm:h-8">
          <img
            src={securityIcon}
            alt="security-icon"
            className="object-cover"
          />
        </span>
      </h1>
      <div className="flex flex-col items-center">
        <p className="text-xl font-medium">Payment Details</p>
        <p className="text-gray-400 mb-6">
          Complete your order by providing your payment details.
        </p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(order)} className="space-y-4">
          <EmailInput
            register={register}
            registerValue="customer.email"
            required
          />
          <CardHolderInput<OrderModel>
            register={register}
            registerName="customer.name"
            label="Card Holder"
            placeholder="Your full name here"
          />
          <CardDetailsInput<OrderModel>
            register={register}
            cardRegisterValue="customer.paymentDetails.cardNumber"
            cvvRegisterValue="customer.paymentDetails.cvv"
          />
          <BillingAddressInput />
          <ShippingMethodsInputs
            setValue={setValue}
            total={calculateCartSubtotal(cartItems)}
            setShippingMethod={setShippingMethod}
          />
          <div className="border-t border-b py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Subtotal</p>
              <p className="font-semibold text-gray-900">
                {cartTotal().toFixed(2)}₪
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm font-medium text-gray-900">Shipping</p>
              <p className="font-semibold text-gray-900">
                {cartTotal() >= 400 ? "Free" : `${shippingPrice}₪`}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-lg font-medium text-gray-900">Total</p>
            <p className="text-2xl font-semibold text-gray-900">
              {cartTotal() >= 400
                ? cartTotal().toFixed(2)
                : (cartTotal() + shippingPrice).toFixed(2)}
              ₪
            </p>
          </div>
          <button
            type="submit"
            className={`mt-6 mb-8 w-full rounded-md px-6 py-3 font-medium text-white ${
              isProcessingOrder || Object.keys(cartItems).length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
            disabled={isProcessingOrder || Object.keys(cartItems).length === 0}
          >
            {isProcessingOrder ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.592L8.414 9.005l-2.122 2.122zM20 12c0-4.418-3.582-8-8-8v3a5 5 0 015 5h3zm-3 7.719A8.001 8.001 0 0112 19.528v-3.592l3.586 3.587 2.122-2.122z"
                  ></path>
                </svg>
                Processing Order...
              </span>
            ) : (
              "Place Order"
            )}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
