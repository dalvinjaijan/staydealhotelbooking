import React, { useState } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";

const PlacesAutoComplete = ({ onSelectLocation }: { onSelectLocation: (address: string, latLng: { lat: number, lng: number }) => void }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({});

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const formattedAddress = results[0].formatted_address; // Get formatted address
      const { lat, lng } = await getLatLng(results[0]);
      const latLng = { lat, lng };

      setSelectedLocation(latLng);

      // Send the formatted address and latLng to the parent component
      onSelectLocation(formattedAddress, latLng);
    } catch (error) {
      console.error("Error fetching geocode and lat/lng:", error);
    }
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search for location"
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full text-black"
      />
                <ComboboxPopover className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
        {status === "OK" && (
           <ComboboxList className="max-h-48 overflow-y-auto">

            {data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description}
              className="p-2 border-b border-gray-100 last:border-none cursor-pointer hover:bg-gray-100"
              />
            ))}
          </ComboboxList>
        )}
      </ComboboxPopover>
    </Combobox>
  );
};

export default PlacesAutoComplete;
