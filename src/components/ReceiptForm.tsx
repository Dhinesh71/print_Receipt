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
  address: string;
}

export const ReceiptForm = () => {
  const { toast } = useToast();
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    phone: "",
    address: ""
  });

  const [orderNumber, setOrderNumber] = useState(() => 
    Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  );
  
  const [date, setDate] = useState(() => 
    new Date().toISOString().split('T')[0]
  );

  const [items, setItems] = useState<ReceiptItem[]>([
    { id: '1', particulars: 'Shirt', rate: 30, quantity: 1, amount: 30 },
    { id: '2', particulars: 'Pant', rate: 30, quantity: 1, amount: 30 },
    { id: '3', particulars: 'T-Shirt', rate: 30, quantity: 1, amount: 30 },
    { id: '4', particulars: 'Lower', rate: 30, quantity: 1, amount: 30 },
    { id: '5', particulars: 'Vesti', rate: 30, quantity: 1, amount: 30 },
    { id: '6', particulars: 'Vest', rate: 10, quantity: 1, amount: 10 }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Receipt Generator</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Create and print professional receipts instantly</p>
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
            <div>
              <Label htmlFor="customerAddress" className="text-base">Address</Label>
              <Input
                id="customerAddress"
                value={customer.address}
                onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
                className="h-12 text-base mt-1"
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
          <div className="receipt-bg border-2 border-receipt-border p-6 max-w-sm mx-auto">
            {/* Header */}
            <div className="text-center border-b-2 border-receipt-border pb-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shirt className="w-6 h-6 text-receipt-header" />
                <h1 className="text-lg font-bold text-receipt-header">Vela Dry Wash – Order Form</h1>
              </div>
              <div className="text-xs text-receipt-text space-y-1">
                <p className="font-medium">Fully Mechanised Laundry Enterprise</p>
                <p>Arasa Thottam, Sellipalayam, Uthukuli – 638 751</p>
                <p>Mob: 95664 42121</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="font-medium">Order No:</span>
                <span>{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{new Date(date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span>{customer.name}</span>
              </div>
              {customer.phone && (
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{customer.phone}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <table className="w-full text-xs border border-receipt-border mb-4">
              <thead>
                <tr className="border-b border-receipt-border">
                  <th className="text-left p-1 border-r border-receipt-border">Item</th>
                  <th className="text-center p-1 border-r border-receipt-border">Rate</th>
                  <th className="text-center p-1 border-r border-receipt-border">Qty</th>
                  <th className="text-right p-1">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-receipt-border">
                    <td className="p-1 border-r border-receipt-border">{item.particulars}</td>
                    <td className="text-center p-1 border-r border-receipt-border">₹{item.rate}</td>
                    <td className="text-center p-1 border-r border-receipt-border">{item.quantity}</td>
                    <td className="text-right p-1">₹{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="border-t-2 border-receipt-border pt-2 mb-4">
              <div className="flex justify-between text-sm font-bold">
                <span>TOTAL:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>


            {/* Footer */}
            <div className="border-t border-receipt-border pt-4 text-center">
              <div className="text-xs text-receipt-muted">
                <p>Thank you for your business!</p>
                <p className="mt-2">Signature: ___________________</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};