"use client";
import { useTheme } from "next-themes";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, ShoppingCart, LogOut } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Navbar({ onCartClick }: { onCartClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const { cart } = useCart();
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          if (userData) {
            setUserName(`${userData.firstName} ${userData.lastName}`);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserName();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const initials = userName
    ? userName.split(" ").map((n: string) => n[0]).join("")
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 border-b border-purple-200 dark:border-purple-800 shadow-lg backdrop-blur-xl rounded-b-2xl">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/logo2.jpeg" alt="Logo" width={30} height={30}/>
          <span className="text-xl font-bold text-purple-700 dark:text-purple-300">Reseller Portal</span>
        </Link>
        <div className="flex items-center gap-6">
     
          <span className="hidden md:inline text-gray-700 dark:text-gray-200 font-medium">
            {user ? `Welcome, ${userName || 'Loading...'}` : "Welcome!"}
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