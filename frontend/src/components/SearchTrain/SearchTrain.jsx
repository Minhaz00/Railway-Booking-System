import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TrainBooking = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `/api/trains?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch trains');
      }
      
      const data = await response.json();
      setTrains(data);
    } catch (err) {
      setError('Failed to fetch train information. Please try again.');
      setTrains([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Trains</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="source" className="block text-sm font-medium">
                  From
                </label>
                <Input
                  id="source"
                  placeholder="Enter source station"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="destination" className="block text-sm font-medium">
                  To
                </label>
                <Input
                  id="destination"
                  placeholder="Enter destination station"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Searching...' : 'Search Trains'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Results */}
      {trains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Trains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trains.map((train) => (
                <div
                  key={train.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Train Number</p>
                      <p className="font-medium">{train.trainNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Departure</p>
                      <p className="font-medium">{train.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Arrival</p>
                      <p className="font-medium">{train.arrivalTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">₹{train.price}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full md:w-auto">
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainBooking;