import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Search } from "lucide-react";

interface ProductService {
  id: string;
  name: string;
  description: string | null;
  type: string;
  unit_price: number;
  currency: string;
}

interface QuotationItem {
  product_service_id: string | null;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  total: number;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateQuotationModal = ({ onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_company: "",
    currency: "USD",
    tax_rate: "16",
    discount_percentage: "0",
    valid_days: "30",
    tracking_number: "",
    notes: "",
    tags: "",
    terms_conditions: `TÉRMINOS Y CONDICIONES

1. Esta cotización es válida por el período especificado.
2. Los precios están sujetos a cambios sin previo aviso después de la fecha de vencimiento.
3. El pago debe realizarse según los términos acordados.
4. Los servicios/productos se entregarán según lo especificado.

Para proceder con esta cotización, por favor realice el pago a través del link de pago incluido.`,
  });
  
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [products, setProducts] = useState<ProductService[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products_services')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    setProducts(data || []);
  };

  const addItem = () => {
    setItems([...items, {
      product_service_id: null,
      item_name: "",
      description: "",
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
      total: 0,
    }]);
  };

  const addProductToItems = (product: ProductService) => {
    const newItem: QuotationItem = {
      product_service_id: product.id,
      item_name: product.name,
      description: product.description || "",
      quantity: 1,
      unit_price: product.unit_price,
      discount_percentage: 0,
      total: product.unit_price,
    };
    setItems([...items, newItem]);
    setShowProductSelector(false);
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price' || field === 'discount_percentage') {
      const subtotal = newItems[index].quantity * newItems[index].unit_price;
      const discount = subtotal * (newItems[index].discount_percentage / 100);
      newItems[index].total = subtotal - discount;
    }
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const globalDiscount = subtotal * (parseFloat(formData.discount_percentage) / 100);
    const subtotalAfterDiscount = subtotal - globalDiscount;
    const taxAmount = subtotalAfterDiscount * (parseFloat(formData.tax_rate) / 100);
    const total = subtotalAfterDiscount + taxAmount;
    return { subtotal, globalDiscount, subtotalAfterDiscount, taxAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un producto o servicio",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { subtotal, globalDiscount, taxAmount, total } = calculateTotals();
      
      // Generar número de cotización
      const { data: numberData, error: numberError } = await supabase
        .rpc('generate_quotation_number');
      
      if (numberError) throw numberError;

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + parseInt(formData.valid_days));

      // Crear cotización
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .insert([{
          quotation_number: numberData,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_company: formData.customer_company || null,
          subtotal,
          discount_percentage: parseFloat(formData.discount_percentage),
          discount_amount: globalDiscount,
          tax_rate: parseFloat(formData.tax_rate),
          tax_amount: taxAmount,
          total,
          currency: formData.currency,
          valid_until: validUntil.toISOString().split('T')[0],
          tracking_number: formData.tracking_number || null,
          notes: formData.notes || null,
          tags: tagsArray,
          terms_conditions: formData.terms_conditions,
        }])
        .select()
        .single();

      if (quotationError) throw quotationError;

      // Crear items
      const itemsToInsert = items.map(item => ({
        quotation_id: quotation.id,
        product_service_id: item.product_service_id,
        item_name: item.item_name,
        description: item.description || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_percentage: item.discount_percentage,
        total: item.total,
      }));

      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: "Cotización creada",
        description: `Cotización ${numberData} creada exitosamente`,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la cotización",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const { subtotal, globalDiscount, subtotalAfterDiscount, taxAmount, total } = calculateTotals();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nueva Cotización</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del cliente */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Información del Cliente</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">Nombre Completo *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customer_email">Email *</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customer_company">Empresa</Label>
                <Input
                  id="customer_company"
                  value={formData.customer_company}
                  onChange={(e) => setFormData({ ...formData, customer_company: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="currency">Moneda *</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Seleccionar moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                    <SelectItem value="GTQ">GTQ - Quetzal Guatemalteco</SelectItem>
                    <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - Libra Esterlina</SelectItem>
                    <SelectItem value="CAD">CAD - Dólar Canadiense</SelectItem>
                    <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                    <SelectItem value="CLP">CLP - Peso Chileno</SelectItem>
                    <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                    <SelectItem value="PEN">PEN - Sol Peruano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="valid_days">Validez (días)</Label>
                <Input
                  id="valid_days"
                  type="number"
                  value={formData.valid_days}
                  onChange={(e) => setFormData({ ...formData, valid_days: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tracking_number">Número de Tracking</Label>
                <Input
                  id="tracking_number"
                  value={formData.tracking_number}
                  onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                  placeholder="Ej: TRK-12345"
                />
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Productos y Servicios</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProductSelector(!showProductSelector)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Seleccionar de Catálogo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Item Manual
                </Button>
              </div>
            </div>

            {showProductSelector && (
              <Card className="p-4 mb-4 bg-muted">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {products.map((product) => (
                    <Button
                      key={product.id}
                      type="button"
                      variant="outline"
                      className="justify-start h-auto py-3"
                      onClick={() => addProductToItems(product)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${product.unit_price}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            <div className="space-y-3">
              {items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="grid md:grid-cols-12 gap-3 items-start">
                    <div className="md:col-span-3">
                      <Label className="text-xs">Nombre</Label>
                      <Input
                        value={item.item_name}
                        onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs">Descripción</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label className="text-xs">Cant.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs">Precio Unit.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs">Desc. %</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.discount_percentage}
                        onChange={(e) => updateItem(index, 'discount_percentage', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-2 flex items-end gap-2">
                      <div className="flex-1">
                        <Label className="text-xs">Total</Label>
                        <div className="font-semibold">${item.total.toFixed(2)}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {items.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay items agregados</p>
                  <p className="text-sm mt-2">Agrega productos o servicios para continuar</p>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-end space-y-2 flex-col items-end">
                  <div className="flex justify-between w-80">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formData.currency} ${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-80 items-center gap-2">
                    <span>Descuento Global:</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                      className="w-20 text-right"
                    />
                    <span>%</span>
                    <span className="font-semibold text-destructive">-{formData.currency} ${globalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-80">
                    <span>Subtotal con Descuento:</span>
                    <span className="font-semibold">{formData.currency} ${subtotalAfterDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-80 items-center gap-2">
                    <span>IVA:</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                      className="w-20 text-right"
                    />
                    <span>%</span>
                    <span className="font-semibold">{formData.currency} ${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-80 text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">{formData.currency} ${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Notas y términos */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="tags">Tags (separados por comas)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Ej: Urgente, Cliente Premium, Proyecto A"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Escribe tags separados por comas para organizar esta cotización
                </p>
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Notas adicionales para el cliente..."
                />
              </div>
              <div>
                <Label htmlFor="terms">Términos y Condiciones</Label>
                <Textarea
                  id="terms"
                  value={formData.terms_conditions}
                  onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })}
                  rows={6}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving || items.length === 0}>
              {isSaving ? "Creando..." : "Crear Cotización"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
