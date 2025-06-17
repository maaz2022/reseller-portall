"use client";
import { useTheme } from "next-themes";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, ShoppingCart, LogOut } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const COLORS = [
  { name: "Purple", value: "#7c3aed" },
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#16a34a" },
  { name: "Pink", value: "#db2777" },
];

export default function Navbar({ onCartClick }: { onCartClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const { cart } = useCart();
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  // Update CSS variable for accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', selectedColor);
  }, [selectedColor]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n: string) => n[0]).join("")
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 border-b border-purple-200 dark:border-purple-800 shadow-lg backdrop-blur-xl rounded-b-2xl">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-bold text-purple-700 dark:text-purple-300">Reseller Portal</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 mr-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                className={`w-6 h-6 rounded-full border-2 ${selectedColor === color.value ? 'border-black dark:border-white ring-2 ring-accent' : 'border-gray-300'} transition-all`}
                style={{ backgroundColor: color.value }}
                aria-label={`Switch to ${color.name}`}
                onClick={() => setSelectedColor(color.value)}
              />
            ))}
          </div>
          <span className="hidden md:inline text-gray-700 dark:text-gray-200 font-medium">
            {user ? `Welcome, ${user.displayName || user.email}` : "Welcome!"}
          </span>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-purple-100 dark:bg-purple-800 hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-700" />}
          </button>
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            aria-label="View cart"
          >
            <ShoppingCart className="w-5 h-5 text-blue-700 dark:text-blue-300" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="User menu"
            >
              {initials}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-purple-100 dark:border-purple-800 py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-purple-50 dark:hover:bg-purple-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 