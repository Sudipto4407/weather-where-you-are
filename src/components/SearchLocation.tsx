
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SearchLocationProps {
  onSearch: (location: string) => void;
}

interface LocationSuggestion {
  name: string;
  country: string;
  admin1?: string;
}

const SearchLocation: React.FC<SearchLocationProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    // Clear previous timeout if it exists
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set a new timeout to avoid making too many API requests
    searchTimeout.current = setTimeout(() => {
      fetchLocationSuggestions(searchQuery);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const fetchLocationSuggestions = async (query: string) => {
    if (query.trim().length < 2) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const locations = data.results.map((result: any) => ({
          name: result.name,
          country: result.country,
          admin1: result.admin1
        }));
        setSuggestions(locations);
        setOpen(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && suggestions.length > 0) {
      onSearch(searchQuery.trim());
      setOpen(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you would convert coordinates to a location name
        // using reverse geocoding
        onSearch("Current Location");
        setSearchQuery("Current Location");
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      }
    );
  };

  const handleSelectLocation = (location: LocationSuggestion) => {
    const locationName = location.admin1 
      ? `${location.name}, ${location.admin1}, ${location.country}`
      : `${location.name}, ${location.country}`;
    setSearchQuery(location.name);
    onSearch(location.name);
    setOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-grow">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {isLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={18} />
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandEmpty>No locations found</CommandEmpty>
                  <CommandGroup>
                    {suggestions.map((location, index) => (
                      <CommandItem 
                        key={`${location.name}-${index}`}
                        onSelect={() => handleSelectLocation(location)}
                        className="cursor-pointer"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{location.name}</span>
                        {location.admin1 && (
                          <span className="text-gray-500 ml-1 text-xs">
                            {location.admin1}, {location.country}
                          </span>
                        )}
                        {!location.admin1 && (
                          <span className="text-gray-500 ml-1 text-xs">
                            {location.country}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Button type="submit" variant="default" disabled={searchQuery.trim().length === 0 || suggestions.length === 0}>
          Search
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={handleUseCurrentLocation}
          title="Use my current location"
        >
          <MapPin size={18} />
        </Button>
      </form>
    </div>
  );
};

export default SearchLocation;
