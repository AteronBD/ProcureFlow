'use client'; // Etkileşim için gerekli
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Az önce oluşturduğumuz dosya

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Son Eklenen Siparişler</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Tedarikçi</th>
              <th className="p-4">Ürün</th>
              <th className="p-4">Durum</th>
              <th className="p-4 text-right">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4">{order.order_no}</td>
                <td className="p-4">{order.supplier}</td>
                <td className="p-4">{order.item}</td>
                <td className="p-4">{order.status}</td>
                <td className="p-4 text-right">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
