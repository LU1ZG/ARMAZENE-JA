import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Warehouse } from "@/entities/Warehouse";
import { Contact as ContactEntity } from "@/entities/Contact";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Send, CheckCircle, Mail } from "lucide-react";

export default function Contact() {
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const loadData = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      
      if (!id) {
        navigate(createPageUrl("Dashboard"));
        return;
      }

      const [warehousesData, userData] = await Promise.all([
        Warehouse.list(),
        User.me().catch(() => null)
      ]);
      
      const foundWarehouse = warehousesData.find(w => w.id === id);
      
      if (!foundWarehouse) {
        navigate(createPageUrl("Dashboard"));
        return;
      }

      setWarehouse(foundWarehouse);
      setUser(userData);
      
      // Pre-fill form if user is logged in
      if (userData) {
        setFormData(prev => ({
          ...prev,
          name: userData.full_name || "",
          email: userData.email || ""
        }));
      }
      
    } catch (error) {
      console.error("Error loading data:", error);
      navigate(createPageUrl("Dashboard"));
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validate fields
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Por favor, preencha todos os campos");
      }

      // Create contact
      await ContactEntity.create({
        warehouse_id: warehouse.id,
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate(createPageUrl(`ListingDetails?id=${warehouse.id}`));
      }, 2000);

    } catch (error) {
      setError(error.message || "Erro ao enviar mensagem. Tente novamente.");
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-xl"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Card className="max-w-md mx-auto text-center shadow-xl rounded-2xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Mensagem Enviada!</h2>
            <p className="text-gray-600 mb-4">
              Sua solicitação de contato foi enviada com sucesso. O proprietário do armazém entrará em contato em breve.
            </p>
            <Button
              onClick={() => navigate(createPageUrl(`ListingDetails?id=${warehouse.id}`))}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Voltar aos Detalhes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl(`ListingDetails?id=${warehouse.id}`))}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Solicitar Contato</h1>
            <p className="text-gray-600">{warehouse?.title}</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 rounded-xl">
            <Mail className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-none rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-500" />
                  Entre em Contato
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Preencha o formulário abaixo para solicitar informações sobre este espaço de armazenagem.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="rounded-xl"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva suas necessidades de armazenagem, período desejado, tipo de mercadoria, etc."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="min-h-[120px] rounded-xl"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold rounded-xl"
                  >
                    {submitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Solicitação
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Warehouse Info Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-none rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Sobre este Espaço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {warehouse?.images?.[0] && (
                  <img
                    src={warehouse.images[0]}
                    alt={warehouse.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{warehouse?.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {warehouse?.city}, {warehouse?.state}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-semibold">R$ {warehouse?.price_per_m3?.toFixed(2)}/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-semibold capitalize">
                      {warehouse?.warehouse_type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {warehouse?.description && (
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {warehouse.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}