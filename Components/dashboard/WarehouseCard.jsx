import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Eye, Heart } from "lucide-react";
import { Favorite } from "@/entities/Favorite";

const typeColors = {
  refrigerado: "bg-blue-100 text-blue-800 border-blue-200",
  seco: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  especial: "bg-purple-100 text-purple-800 border-purple-200",
  geral: "bg-gray-100 text-gray-800 border-gray-200"
};

const typeLabels = {
  refrigerado: "Refrigerado",
  seco: "Seco",
  especial: "Especial", 
  geral: "Geral"
};

export default function WarehouseCard({ warehouse, user }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const primaryImage = warehouse.images?.[0];

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites (would need a delete method)
        setIsFavorited(false);
      } else {
        // Add to favorites
        await Favorite.create({
          warehouse_id: warehouse.id,
          user_email: user.email
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
    setFavoriteLoading(false);
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border-gray-100 rounded-2xl">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {primaryImage ? (
          <img 
            src={primaryImage} 
            alt={warehouse.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500">Sem imagem disponível</span>
            </div>
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${typeColors[warehouse.warehouse_type]} border font-medium rounded-full`}>
            {typeLabels[warehouse.warehouse_type]}
          </Badge>
        </div>

        {/* Favorite Button */}
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
            onClick={handleFavorite}
            disabled={favoriteLoading}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        )}
      </div>

      <CardContent className="p-6">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
          {warehouse.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">
            {warehouse.city}, {warehouse.state}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900">
            R$ {warehouse.price_per_m3?.toFixed(2)}
            <span className="text-sm font-normal text-gray-500 ml-1">/m³</span>
          </div>
        </div>

        {/* Description Preview */}
        {warehouse.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {warehouse.description}
          </p>
        )}

        {/* Action Button */}
        <Link to={createPageUrl(`ListingDetails?id=${warehouse.id}`)}>
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors rounded-xl">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}