import React from "react";
import { Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ hasFilters, onClearFilters }) {
  if (hasFilters) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nenhum resultado encontrado
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Não encontramos espaços que correspondem aos seus filtros. 
          Tente ajustar os critérios de busca.
        </p>
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          Limpar Filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="w-8 h-8 text-orange-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhum espaço disponível ainda
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Seja o primeiro a cadastrar um espaço de armazenagem na plataforma!
      </p>
    </div>
  );
}