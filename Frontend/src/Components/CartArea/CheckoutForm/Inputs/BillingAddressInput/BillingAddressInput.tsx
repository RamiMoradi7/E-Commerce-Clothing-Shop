import { useFormContext } from "react-hook-form";
import { OrderModel } from "../../../../../Models/OrderModel";
import { useAddressData } from "../../../../../hooks/useAddressData";
import { City } from "../../../../../types/City";
import { Country } from "../../../../../types/Country";
import { State } from "../../../../../types/State";
import AddressSelect from "./AddressSelect";
import PhoneInput from "./PhoneInput";

export default function BillingAddressInput(): JSX.Element {
  const { setValue } = useFormContext<OrderModel>();
  const {
    countries,
    states,
    cities,
    getStatesByCountry,
    getCitiesByState,
    selections,
    setSelections,
  } = useAddressData();

  const handleCountryChange = async (selectedCountry: Country) => {
    setSelections({ state: null, city: null, country: selectedCountry });
    await getStatesByCountry(selectedCountry.country_name);
  };
  
  const handleStateChange = async (selectedState: State) => {
    setSelections({ ...selections, city: null, state: selectedState });
    await getCitiesByState(selectedState.state_name);
  };

  const handleCityChange = (selectedCity: City) => {
    setSelections({ ...selections, city: selectedCity });
  };

  return (
    <>
      <div className="mt-4 mb-2 block text-sm font-medium">Billing Address</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AddressSelect<Country>
          label="Country"
          fieldName="country_name"
          values={countries ? countries : []}
          onChange={handleCountryChange}
          defaultValue={selections?.country}
          name="customer.country"
        />
        <AddressSelect<State>
          label="Region"
          fieldName="state_name"
          values={states ? states : []}
          onChange={handleStateChange}
          defaultValue={selections?.state}
          msg="Select Country First."
          name="customer.region"
        />
        <AddressSelect<City>
          label="City"
          fieldName="city_name"
          values={cities ? cities : []}
          onChange={handleCityChange}
          defaultValue={selections?.city}
          msg="Select State First."
          name="customer.city"
        />
      </div>
      <div className="flex flex-col sm:flex-row mt-4">
        <input
          name="street"
          className="w-full sm:w-7/12 p-2.5 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-200 shadow-sm outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 mb-3 sm:mb-0"
          type="text"
          placeholder="Street"
          onChange={(e) => setValue("customer.street", e.target.value)}
        />
        <input
          name="apartment"
          className="w-full sm:w-5/12 p-2.5 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-200 shadow-sm outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 mb-3 sm:mb-0"
          type="text"
          placeholder="Apartment"
          onChange={(e) => setValue("customer.apartment", e.target.value)}
        />
      </div>
      <PhoneInput selectedCountry={selections?.country} />
    </>
  );
}
