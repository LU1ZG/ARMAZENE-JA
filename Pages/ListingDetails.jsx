import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Warehouse } from "@/entities/Warehouse";
import { User } from "@/entities/User";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload, X, CheckCircle, ArrowLeft } from "lucide-react";

export default function CreateListing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_per_m3: "",
    warehouse_type: "",
    country: "Brasil",
    state: "",
    city: "",
    neighborhood: "",
    street: "",
    zip_code: "",
    company_cnpj: "",
    images: []
  });

  const checkUserAccess = useCallback(async () => {
    try {
      const currentUser = await User.me();
      if (currentUser.user_type !== "warehouse") {
        navigate(createPageUrl("Dashboard"));
        return;
      }
      setUser(currentUser);
      setFormData(prev => ({
        ...prev,
        company_cnpj: currentUser.cnpj || ""
      }));
    } catch (error) {
      navigate(createPageUrl("Home"));
    }
  }, [navigate]);

  useEffect(() => {
    checkUserAccess();
  }, [checkUserAccess]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.images.length + files.length > 3) {
      setError("Você pode adicionar no máximo 3 imagens");
      return;
    }

    setUploadingImages(true);
    setError("");

    try {
      const uploadPromises = files.map(file => UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      
      const imageUrls = results.map(result => result.file_url);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    } catch (error) {
      setError("Erro ao fazer upload das imagens. Tente novamente.");
    }
    
    setUploadingImages(false);
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title || !formData.price_per_m3 || !formData.warehouse_type || !formData.city || !formData.state) {
        throw new Error("Por favor, preencha todos os campos obrigatórios");
      }

      await Warehouse.create({
        ...formData,
        price_per_m3: parseFloat(formData.price_per_m3)
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 2000);
    } catch (error) {
      setError(error.message || "Erro ao criar anúncio. Tente novamente.");
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md mx-auto text-center shadow-xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Anúncio Criado!</h2>
            <p className="text-gray-600">
              Seu espaço foi cadastrado com sucesso e já está disponível para interessados.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Criar Anúncio</h1>
            <p className="text-gray-600">Cadastre seu espaço de armazenagem</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Anúncio *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Armazém 500m² - Centro"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_per_m3">Preço por m³ (R$) *</Label>
                  <Input
                    id="price_per_m3"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ex: 25.50"
                    value={formData.price_per_m3}
                    onChange={(e) => handleInputChange("price_per_m3", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse_type">Tipo de Armazém *</Label>
                <Select
                  value={formData.warehouse_type}
                  onValueChange={(value) => handleInputChange("warehouse_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Geral</SelectItem>
                    <SelectItem value="refrigerado">Refrigerado</SelectItem>
                    <SelectItem value="seco">Seco</SelectItem>
                    <SelectItem value="especial">Especial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva as características do seu armazém, facilidades, localização..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Address */}
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {brazilianStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    placeholder="Ex: São Paulo"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    placeholder="Ex: Centro"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input
                    id="zip_code"
                    placeholder="00000-000"
                    value={formData.zip_code}
                    onChange={(e) => handleInputChange("zip_code", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Rua/Endereço</Label>
                  <Input
                    id="street"
                    placeholder="Rua das Flores, 123"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_cnpj">CNPJ</Label>
                  <Input
                    id="company_cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.company_cnpj}
                    onChange={(e) => handleInputChange("company_cnpj", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Images */}
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Imagens (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Adicione até 3 imagens do seu armazém para atrair mais interessados
                </p>

                {/* Upload Button */}
                {formData.images.length < 3 && (
                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label 
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-500" />
                      {uploadingImages ? "Enviando..." : "Adicionar Imagens"}
                    </Label>
                  </div>
                )}

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold"
            >
              {loading ? "Criando Anúncio..." : "Criar Anúncio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}