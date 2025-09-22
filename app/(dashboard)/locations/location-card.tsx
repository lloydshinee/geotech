import { Button } from "@/components/ui/button";
import { UserLocation } from "@prisma/client";
import {
  Calendar,
  Edit,
  MapIcon,
  MapPin,
  MoreVertical,
  Navigation,
  Trash2,
} from "lucide-react";

export function LocationCard({ location }: { location: UserLocation }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {location.name}
              </h3>
            </div>
            {location.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {location.description}
              </p>
            )}
          </div>
          <div className="relative">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Navigation className="w-4 h-4 mr-2" />
            <span className="font-mono text-xs">
              {formatCoordinates(location.latitude, location.longitude)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Added {formatDate(location.createdAt.toString())}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <MapIcon className="w-4 h-4 mr-2" />
            View on Map
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
