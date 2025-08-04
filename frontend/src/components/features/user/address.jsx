import React, { useEffect, useState } from 'react';
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';
import {
  useFetchUserProfileQuery,
  useUpdateUserAddressMutation,
} from '../../../redux/api/userApiSlice';

const AddressForm = () => {
  const { data: userData, isLoading: loadingUser } = useFetchUserProfileQuery();
  const [updateUserAddress, { isLoading, isSuccess, error }] =
    useUpdateUserAddressMutation();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [phone, setPhone] = useState('');

  // Populate user address data if available
  useEffect(() => {
    if (userData?.data?.address) {
      const { street, city, state, country, postalCode, phone } = userData.data.address;
      setAddressLine(street || '');
      setSelectedCity(city || '');
      setSelectedState(state || '');
      setSelectedCountry(country || '');
      setPostalCode(postalCode || '');
      setPhone(phone || '');
    }
  }, [userData]);

  // Load country list once
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const allStates = State.getStatesOfCountry(selectedCountry);
      setStates(allStates);
      setSelectedState('');
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState && selectedCountry) {
      const allCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(allCities);
      setSelectedCity('');
    }
  }, [selectedState, selectedCountry]);

  // Convert data to react-select format
  const countryOptions = countries.map((c) => ({ label: c.name, value: c.isoCode }));
  const stateOptions = states.map((s) => ({ label: s.name, value: s.isoCode }));
  const cityOptions = cities.map((c) => ({ label: c.name, value: c.name }));

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!/^\+?\d{10,15}$/.test(phone)) {
    return alert('❌ Invalid phone number');
  }

  const addressPayload = {
    street: addressLine,
    city: selectedCity,
    state: selectedState,
    country: selectedCountry,
    postalCode,
    phone,
  };

  try {
    await updateUserAddress({ address: addressPayload }).unwrap();
    alert('✅ Address updated successfully');
  } catch (err) {
    console.error(err);
    alert(err?.data?.message || 'Failed to update address');
  }
};


  if (loadingUser) return <p className="text-white">Loading user data...</p>;

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-white text-xl font-semibold mb-4">Update Address</h2>

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-white mb-1">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 9876543210"
          className="w-full bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded-md"
          required
        />
      </div>

      {/* Street */}
      <div className="mb-4">
        <label className="block text-white mb-1">Street Address</label>
        <textarea
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded-md"
          rows="2"
          required
        />
      </div>

      {/* Postal Code */}
      <div className="mb-4">
        <label className="block text-white mb-1">Postal Code</label>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="e.g. 110001"
          className="w-full bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded-md"
        />
      </div>

      {/* Country */}
      <div className="mb-4">
        <label className="block text-white mb-1">Country</label>
        <Select
          options={countryOptions}
          value={countryOptions.find((c) => c.value === selectedCountry)}
          onChange={(option) => setSelectedCountry(option?.value || '')}
          isClearable
          isSearchable
          className="text-black"
        />
      </div>

      {/* State */}
      <div className="mb-4">
        <label className="block text-white mb-1">State</label>
        <Select
          options={stateOptions}
          value={stateOptions.find((s) => s.value === selectedState)}
          onChange={(option) => setSelectedState(option?.value || '')}
          isClearable
          isSearchable
          isDisabled={!stateOptions.length}
          className="text-black"
        />
      </div>

      {/* City */}
      <div className="mb-4">
        <label className="block text-white mb-1">City</label>
        <Select
          options={cityOptions}
          value={cityOptions.find((c) => c.value === selectedCity)}
          onChange={(option) => setSelectedCity(option?.value || '')}
          isClearable
          isSearchable
          isDisabled={!cityOptions.length}
          className="text-black"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
      >
        {isLoading ? 'Saving...' : 'Save Address'}
      </button>

      {isSuccess && <p className="text-green-400 mt-2">✔️ Address updated.</p>}
      {error && <p className="text-red-500 mt-2">❌ {error?.data?.message}</p>}
    </form>
  );
};

export default AddressForm;
