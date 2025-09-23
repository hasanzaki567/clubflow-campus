import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon, point } from 'leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MapPin, Navigation } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Fix for default markers
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const createCustomIcon = (color: string, icon: React.ReactNode) => {
  return divIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${icon}</div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const clubIcon = createCustomIcon('#3b82f6', 'C');
const eventIcon = createCustomIcon('#10b981', 'E');

// Type definitions for map locations
interface MapLocation {
  id: string | number;
  name: string;
  type: 'club' | 'event';
  lat: number;
  lng: number;
  members?: number;
  attendees?: number;
  admin?: string;
  club?: string;
}

// Sample coordinates for different locations (you can replace with real data)
const sampleLocations: MapLocation[] = [
  { id: 1, name: 'Computer Science Club', type: 'club', lat: 40.7128, lng: -74.0060, members: 245 },
  { id: 2, name: 'Photography Club', type: 'club', lat: 40.7589, lng: -73.9851, members: 156 },
  { id: 3, name: 'Tech Talk 2024', type: 'event', lat: 40.7282, lng: -73.7949, attendees: 85 },
  { id: 4, name: 'Art Exhibition', type: 'event', lat: 40.7505, lng: -73.9934, attendees: 120 },
  { id: 5, name: 'Drama Society', type: 'club', lat: 40.7614, lng: -73.9776, members: 189 },
  { id: 6, name: 'Sports Club', type: 'club', lat: 40.7505, lng: -73.9934, members: 312 },
];

// Map controller component to handle map interactions
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
};

interface InteractiveMapProps {
  height?: string;
  showControls?: boolean;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  height = '400px',
  showControls = true
}) => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(11);

  // Fetch real data from API
  const { data: clubs } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => apiClient.getClubs(),
  });

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiClient.getEvents(),
  });

  // Combine real data with sample locations for demo
  const allLocations = [
    ...sampleLocations,
    ...(clubs?.map((club, index) => ({
      id: `club-${club.id}`,
      name: club.name,
      type: 'club' as const,
      lat: 40.7128 + (index * 0.01), // Spread out for demo
      lng: -74.0060 + (index * 0.01),
      members: club.member_count,
      admin: club.admin_name,
    })) || []),
    ...(events?.map((event, index) => ({
      id: `event-${event.id}`,
      name: event.title,
      type: 'event' as const,
      lat: 40.7282 + (index * 0.005), // Spread out for demo
      lng: -73.9949 + (index * 0.005),
      attendees: event.current_attendees,
      club: event.club_name,
    })) || []),
  ];

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    setMapZoom(13);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 1));
  };

  const handleResetView = () => {
    setMapCenter([40.7128, -74.0060]);
    setMapZoom(11);
    setSelectedLocation(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Interactive Campus Map
          </CardTitle>
          <CardDescription>
            View clubs and events locations on an interactive map
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height, width: '100%' }}
              className="rounded-lg border"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController center={mapCenter} zoom={mapZoom} />

              {allLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={location.type === 'club' ? clubIcon : eventIcon}
                  eventHandlers={{
                    click: () => handleLocationClick(location),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{location.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={location.type === 'club' ? 'default' : 'secondary'}>
                          {location.type}
                        </Badge>
                        {location.type === 'club' ? (
                          <span className="text-sm text-muted-foreground">
                            {location.members} members
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {location.attendees} attendees
                          </span>
                        )}
                      </div>
                      {location.type === 'club' && location.admin && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Admin: {location.admin}
                        </p>
                      )}
                      {location.type === 'event' && location.club && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Club: {location.club}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {showControls && (
              <div className="absolute top-2 right-2 flex flex-col gap-2 z-[1000]">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleZoomIn}
                  className="h-8 w-8 p-0"
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleZoomOut}
                  className="h-8 w-8 p-0"
                >
                  −
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetView}
                  className="h-8 w-8 p-0"
                >
                  <Navigation className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Clubs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Events</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Users className="h-4 w-4" />
              <span>{allLocations.filter(l => l.type === 'club').length} Clubs</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{allLocations.filter(l => l.type === 'event').length} Events</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedLocation.type === 'club' ? (
                <Users className="h-5 w-5 text-blue-500" />
              ) : (
                <Calendar className="h-5 w-5 text-green-500" />
              )}
              {selectedLocation.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type:</span>
                <Badge variant={selectedLocation.type === 'club' ? 'default' : 'secondary'}>
                  {selectedLocation.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedLocation.type === 'club' ? 'Members:' : 'Attendees:'}
                </span>
                <span className="font-medium">
                  {selectedLocation.type === 'club' ? selectedLocation.members : selectedLocation.attendees}
                </span>
              </div>
              {selectedLocation.type === 'club' && selectedLocation.admin && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Admin:</span>
                  <span className="font-medium">{selectedLocation.admin}</span>
                </div>
              )}
              {selectedLocation.type === 'event' && selectedLocation.club && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Club:</span>
                  <span className="font-medium">{selectedLocation.club}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Coordinates:</span>
                <span className="font-mono text-xs">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;
