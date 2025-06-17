"use client";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { X } from "lucide-react";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-50 transition-all ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl border-l border-purple-200 dark:border-purple-800 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-purple-100 dark:border-purple-800">
          <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300">Your Cart</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors">
            <X className="w-6 h-6 text-purple-700 dark:text-purple-300" />
          </button>
        </div>
        <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-purple-700 dark:text-purple-200">{item.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">£{item.price} x {item.quantity}</div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4 text-red-600 dark:text-red-300" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-5 border-t border-purple-100 dark:border-purple-800">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg text-purple-700 dark:text-purple-200">Total:</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">£{total.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-200 mb-2"
            disabled={cart.length === 0}
          >
            Checkout
          </button>
          <button
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </button>
        </div>
      </aside>
    </div>
  );
} 