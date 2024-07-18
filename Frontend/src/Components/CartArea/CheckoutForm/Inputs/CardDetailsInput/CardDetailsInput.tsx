import { Path, useForm } from "react-hook-form";
import { ExpirationDatePicker } from "./ExpirationDatePicker";

interface CardDetailsInputProps<T> {
  register: ReturnType<typeof useForm<T>>["register"];
  cardRegisterValue: string;
  cvvRegisterValue: string;
}

export default function CardDetailsInput<T>({
  register,
  cardRegisterValue,
  cvvRegisterValue,
}: CardDetailsInputProps<T>): JSX.Element {
  return (
    <>
      <div className="space-y-4 mt-3">
        <label className=" text-center text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-2/3 lg:w-3/4 px-2">
            <div className="relative">
              <input
                type="text"
                id="card-no"
                name="card-no"
                className="w-full rounded-md border text-center border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="4580-3900-xxxx-xxxx"
                {...register(cardRegisterValue as unknown as Path<T>)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.5 6.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M2 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm16 2v8H2V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1zm-1 10H3a1 1 0 0 1-1-1V11h16v4a1 1 0 0 1-1 1z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 lg:w-1/4 px-2">
            <input
              type="text"
              name="credit-cvc"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="CVV"
              maxLength={3}
              {...register(cvvRegisterValue as unknown as Path<T>)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-2/3 lg:w-3/4 px-2">
            <label
              htmlFor="expiration-date"
              className="block text-sm font-medium text-gray-700"
            >
              Expiration Date
            </label>
            <div className="mt-1 flex items-center">
              <ExpirationDatePicker />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
