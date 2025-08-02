import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Printer, Shirt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReceiptItem {
  id: string;
  particulars: string;
  rate: number;
  quantity: number;
  amount: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
}

export const ReceiptForm = () => {
  const { toast } = useToast();
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    phone: ""
  });

  const [orderNumber, setOrderNumber] = useState(() => 
    Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  );
  
  const [date, setDate] = useState(() => 
    new Date().toISOString().split('T')[0]
  );

  const [items, setItems] = useState<ReceiptItem[]>([
    { id: '1', particulars: '', rate: 0, quantity: 1, amount: 0 }
  ]);

  const calculateAmount = (rate: number, quantity: number) => rate * quantity;

  const updateItem = (id: string, field: keyof ReceiptItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'rate' || field === 'quantity') {
          updated.amount = calculateAmount(
            field === 'rate' ? Number(value) : updated.rate,
            field === 'quantity' ? Number(value) : updated.quantity
          );
        }
        return updated;
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      particulars: '',
      rate: 0,
      quantity: 1,
      amount: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    } else {
      toast({
        title: "Cannot remove item",
        description: "At least one item is required",
        variant: "destructive"
      });
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print initiated",
      description: "Receipt is being prepared for printing"
    });
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 print:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Vela Dry Wash</h1>
          <p className="text-muted-foreground text-sm sm:text-base">made with 6ixmindslabs</p>
        </div>

        {/* Customer Form - Print Hidden */}
        <Card className="p-4 sm:p-6 print:hidden">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Customer Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName" className="text-base">Customer Name</Label>
              <Input
                id="customerName"
                value={customer.name}
                onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter customer name"
                className="h-12 text-base mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone" className="text-base">Phone Number</Label>
              <Input
                id="customerPhone"
                value={customer.phone}
                onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                className="h-12 text-base mt-1"
                type="tel"
              />
            </div>

          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <Label htmlFor="orderNumber" className="text-base">Order Number</Label>
              <Input
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Order number"
                className="h-12 text-base mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date" className="text-base">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 text-base mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Items Form - Print Hidden */}
        <Card className="p-4 sm:p-6 print:hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">Order Items</h2>
            <Button onClick={addItem} size="lg" variant="outline" className="w-full sm:w-auto h-12">
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-3">
            {/* Column Headers */}
            <div className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 border-b border-border">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-muted-foreground">Item</span>
              </div>
              <div className="w-12 sm:w-14 md:w-16 flex-shrink-0 text-center">
                <span className="text-sm font-medium text-muted-foreground">Qty</span>
              </div>
              <div className="w-14 sm:w-16 md:w-20 flex-shrink-0 text-center">
                <span className="text-sm font-medium text-muted-foreground">Price</span>
              </div>
              <div className="w-14 sm:w-16 md:w-20 flex-shrink-0 text-center">
                <span className="text-sm font-medium text-muted-foreground">Amount</span>
              </div>
              <div className="w-8 sm:w-10 flex-shrink-0">
                <span className="text-sm font-medium text-muted-foreground">Action</span>
              </div>
            </div>
            
            {/* Simple single-line item layout */}
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 border border-border rounded-lg bg-background">
                {/* Item Name */}
                <div className="flex-1 min-w-0">
                  <Input
                    value={item.particulars}
                    onChange={(e) => updateItem(item.id, 'particulars', e.target.value)}
                    placeholder="Item name"
                    className="h-10 text-sm w-full"
                    style={{ minWidth: '80px' }}
                  />
                </div>
                
                {/* Quantity */}
                <div className="w-12 sm:w-14 md:w-16 flex-shrink-0">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    placeholder="Qty"
                    className="h-10 text-sm text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="1"
                  />
                </div>
                
                {/* Rate */}
                <div className="w-14 sm:w-16 md:w-20 flex-shrink-0">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                    placeholder="Rate"
                    className="h-10 text-sm text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                
                {/* Amount (read-only) */}
                <div className="w-14 sm:w-16 md:w-20 text-center flex-shrink-0">
                  <div className="h-10 flex items-center justify-center bg-muted rounded-md px-1 sm:px-2">
                    <span className="text-xs sm:text-sm font-medium">₹{item.amount}</span>
                  </div>
                </div>
                
                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="h-10 w-8 sm:w-10 p-0 text-destructive hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-primary/5 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
            </div>
            <Button onClick={handlePrint} size="lg" className="w-full h-14 text-lg gap-3">
              <Printer className="w-6 h-6" />
              Print Receipt
            </Button>
          </div>
        </Card>

        {/* Print Receipt */}
        <div className="hidden print:block print:p-0 print:m-0">
          <div className="max-w-[230px] mx-auto bg-white p-2 font-mono text-xs">
            {/* Header */}
            <div className="text-center mb-2">
              <h1 className="text-sm font-bold">Vela Dry Wash</h1>
              <p className="text-xs">Fully Mechanised Laundry Enterprise</p>
              <p className="text-xs">Arasa Thottam, Sellipalayam, Uthukuli – 638 751</p>
              <p className="text-xs">Mob: 95664 42121</p>
            </div>

            {/* Separator */}
            <div className="text-center mb-2">- - - - - - - - - - - - - - - -</div>

            {/* Order Details */}
            <div className="space-y-1 mb-2">
              <div>Date: {new Date(date).toLocaleDateString('en-GB')}, {new Date().toLocaleTimeString()}</div>
              <div>Customer: {customer.name}</div>
              {customer.phone && <div>Phone: {customer.phone}</div>}
            </div>

            {/* Items Header */}
            <div className="mb-1 font-mono">
              <div className="flex gap-4">
                <span className="w-16 text-left">Item</span>
                <span className="w-6 text-right">Qty</span>
                <span className="w-12 text-right">Price</span>
                <span className="w-12 text-right">Total</span>
              </div>
            </div>

            {/* Header Divider */}
            <div className="mb-1 font-mono">--------------------------------</div>

            {/* Items */}
            <div className="space-y-1 mb-2 font-mono">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <span className="w-16 text-left truncate">{item.particulars}</span>
                  <span className="w-6 text-right">{item.quantity}</span>
                  <span className="w-12 text-right">₹{item.rate.toFixed(2)}</span>
                  <span className="w-12 text-right">₹{item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Separator */}
            <div className="text-center mb-2">- - - - - - - - - - - - - - - - - - - -</div>

            {/* Total */}
            <div className="mb-2">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Separator */}
            <div className="text-center mb-2">- - - - - - - - - - - - - - - - - - - -</div>

            {/* Footer */}
            <div className="text-center">
              <p>Thank you!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};