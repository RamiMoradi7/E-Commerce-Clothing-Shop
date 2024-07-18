import { useSelector } from "react-redux";
import CheckoutImage from "../Assets/Images/LandingPageShoes.jpg";
import { useTitle } from "../../hooks/useTitle";
import { AppState } from "../../Redux/AppState";
import CheckoutProgress from "../CartArea/CheckoutProgress/CheckoutProgress";
import CheckoutForm from "../CartArea/CheckoutForm/CheckoutForm";
import CartItem from "../CartArea/CartItem/CartItem";
import { calculateCartSubtotal } from "../../Utils/CalculateCart";

export default function Checkout(): JSX.Element {
  useTitle("Checkout");
  const cartItems = useSelector(
    (appState: AppState) => appState.cart?.products
  );

  return (
    <>
      <CheckoutProgress step={2} />
      <div className="relative sm:py-12 lg:col-span-6 lg:py-24 w-full bg-gray-50 p-4 -mt-5">
        <div className="grid min-h-screen grid-cols-1 sm:grid-cols-10 gap-8">
          <div className="col-span-full sm:col-span-6 px-4 sm:px-0">
            <CheckoutForm />
            <div className="mx-auto max-w-lg  shadow-md p-8">
              <div className="mt-6 text-sm text-gray-500">
                By placing this order you agree to the{" "}
                <div className="text-teal-400 underline hover:text-teal-600">
                  Terms and Conditions
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-full sm:col-span-4">
            <div className="bg-white rounded-3xl shadow-md overflow-hidden">
              <div className="relative h-64">
                <img
                  src={CheckoutImage}
                  alt="checkout"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                {Object.keys(cartItems).length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {Object.keys(cartItems).map((key) => (
                      <li key={key} className="py-4">
                        <CartItem product={cartItems[key].product} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-lg font-thin mt-8 text-center">
                    Your cart is empty.
                  </p>
                )}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total price:</span>
                    <span>{calculateCartSubtotal(cartItems)}₪</span>
                  </div>
                  <div className="flex justify-between text-sm font-thin">
                    <span>Vat: 17%</span>
                    <span>
                      {(calculateCartSubtotal(cartItems) * 0.17).toFixed(0)}₪
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
