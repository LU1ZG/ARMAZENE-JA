import React, { useState, useEffect } from "react";
import { Warehouse } from "@/entities/Warehouse";
import { User } from "@/entities/User";
import { Search, MapPin, Filter, Loader2, Package, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WarehouseCard from "../components/dashboard/WarehouseCard";
import EmptyState from "../components/dashboard/EmptyState";

export default function Dashboard() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState("recent");
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    state: "",
    type: "",
    minPrice: "",
    maxPrice: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [warehousesData, userData] = await Promise.all([
        Warehouse.filter({ is_active: true }, "-created_date"),
        User.me().catch(() => null)
      ]);
      
      setWarehouses(warehousesData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Trigger re-render with current filters
    setWarehouses([...warehouses]);
  };

  const getSortedWarehouses = (warehouseList) => {
    switch (sortBy) {
      case "price_low":
        return [...warehouseList].sort((a, b) => (a.price_per_m3 || 0) - (b.price_per_m3 || 0));
      case "price_high":
        return [...warehouseList].sort((a, b) => (b.price_per_m3 || 0) - (a.price_per_m3 || 0));
      case "recent":
      default:
        return [...warehouseList].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
  };

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = !filters.search || 
      warehouse.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      warehouse.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCity = !filters.city || 
      warehouse.city.toLowerCase().includes(filters.city.toLowerCase());
    
    const matchesState = !filters.state || 
      warehouse.state.toLowerCase().includes(filters.state.toLowerCase());
    
    const matchesType = !filters.type || warehouse.warehouse_type === filters.type;
    
    const matchesMinPrice = !filters.minPrice || warehouse.price_per_m3 >= parseFloat(filters.minPrice);
    
    const matchesMaxPrice = !filters.maxPrice || warehouse.price_per_m3 <= parseFloat(filters.maxPrice);

    return matchesSearch && matchesCity && matchesState && matchesType && matchesMinPrice && matchesMaxPrice;
  });

  const sortedWarehouses = getSortedWarehouses(filteredWarehouses);

  const getUniqueValues = (field) => {
    return [...new Set(warehouses.map(w => w[field]).filter(Boolean))];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Carregando espaços disponíveis...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Encontre o Espaço Ideal para Seu Negócio
            </h1>
            <p className="text-gray-600 text-lg">
              Descubra armazéns disponíveis com as melhores condições
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Busque por título, descrição, cidade..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-12 h-12 text-lg border-gray-200 focus:border-orange-300 rounded-xl"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 h-12 rounded-xl font-medium"
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Filtros e Ordenação</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              <Select value={filters.state} onValueChange={(value) => handleFilterChange("state", value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todos os estados</SelectItem>
                  {getUniqueValues("state").map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.city} onValueChange={(value) => handleFilterChange("city", value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todas as cidades</SelectItem>
                  {getUniqueValues("city").map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todos os tipos</SelectItem>
                  <SelectItem value="refrigerado">Refrigerado</SelectItem>
                  <SelectItem value="seco">Seco</SelectItem>
                  <SelectItem value="especial">Especial</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Preço mín. (R$)"
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="rounded-xl"
              />

              <Input
                placeholder="Preço máx. (R$)"
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="rounded-xl"
              />

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    <div className="flex items-center gap-2">
                      <SortDesc className="w-4 h-4" />
                      Mais recentes
                    </div>
                  </SelectItem>
                  <SelectItem value="price_low">
                    <div className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4" />
                      Menor preço
                    </div>
                  </SelectItem>
                  <SelectItem value="price_high">
                    <div className="flex items-center gap-2">
                      <SortDesc className="w-4 h-4" />
                      Maior preço
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setFilters({ search: "", city: "", state: "", type: "", minPrice: "", maxPrice: "" });
                  setSortBy("recent");
                }}
                className="rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {sortedWarehouses.length} espaços encontrados
            </h2>
            {(filters.search || filters.city || filters.state || filters.type) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.search && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 rounded-full">
                    Busca: "{filters.search}"
                  </Badge>
                )}
                {filters.city && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 rounded-full">
                    <MapPin className="w-3 h-3 mr-1" />
                    {filters.city}
                  </Badge>
                )}
                {filters.state && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 rounded-full">
                    {filters.state}
                  </Badge>
                )}
                {filters.type && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 rounded-full">
                    {filters.type}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Warehouses Grid */}
        {sortedWarehouses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWarehouses.map((warehouse) => (
              <WarehouseCard key={warehouse.id} warehouse={warehouse} user={user} />
            ))}
          </div>
        ) : (
          <EmptyState 
            hasFilters={!!(filters.search || filters.city || filters.state || filters.type)}
            onClearFilters={() => {
              setFilters({ search: "", city: "", state: "", type: "", minPrice: "", maxPrice: "" });
              setSortBy("recent");
            }}
          />
        )}
      </div>
    </div>
  );
}