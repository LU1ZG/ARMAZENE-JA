import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Favorite } from "@/entities/Favorite";
import { Warehouse } from "@/entities/Warehouse";
import { User } from "@/entities/User";
import { Heart, Loader2 } from "lucide-react";
import WarehouseCard from "../components/dashboard/WarehouseCard";
import EmptyState from "../components/dashboard/EmptyState";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const currentUser = await User.me();
      if (!currentUser) {
        navigate(createPageUrl("Home"));
        return;
      }

      const [favoritesData, warehousesData] = await Promise.all([
        Favorite.filter({ user_email: currentUser.email }),
        Warehouse.filter({ is_active: true })
      ]);

      // Get warehouses that are favorited
      const favoriteWarehouseIds = favoritesData.map(f => f.warehouse_id);
      const favoriteWarehouses = warehousesData.filter(w => 
        favoriteWarehouseIds.includes(w.id)
      );

      setFavorites(favoritesData);
      setWarehouses(favoriteWarehouses);
      setUser(currentUser);
      
    } catch (error) {
      console.error("Error loading favorites:", error);
      navigate(createPageUrl("Dashboard"));
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Carregando favoritos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meus Favoritos</h1>
              <p className="text-gray-600">Espaços que você salvou para consultar depois</p>
            </div>
          </div>
          
          <div className="text-gray-600">
            {warehouses.length} {warehouses.length === 1 ? 'espaço favoritado' : 'espaços favoritados'}
          </div>
        </div>

        {/* Warehouses Grid */}
        {warehouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <WarehouseCard 
                key={warehouse.id} 
                warehouse={warehouse} 
                user={user}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Explore os espaços disponíveis e favorite aqueles que mais chamarem sua atenção.
            </p>
            <button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Explorar Espaços
            </button>
          </div>
        )}
      </div>
    </div>
  );
}