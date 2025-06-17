"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function PremiumDashboard() {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyPremiumAccess = async () => {
      if (!loading && user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();

          // If user is not premium, redirect to home
          if (!userData || userData.role !== 'premium') {
            console.log("User is not premium, redirecting to home");
            router.replace("/");
            return;
          }

          // If payment status is not completed, redirect to payment
          if (!userData.paymentStatus || userData.paymentStatus !== 'completed') {
            console.log("Payment not completed, redirecting to payment");
            router.replace("/payment");
            return;
          }

          // Only verify payment intent if we have one
          if (userData.paymentIntentId) {
            const response = await fetch("/api/verify-payment-status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentIntentId: userData.paymentIntentId,
              }),
            });

            const verificationData = await response.json();

            if (!verificationData.verified) {
              console.log("Payment verification failed:", verificationData.error);
              toast.error("Premium access verification failed. Please contact support.");
              router.replace("/");
              return;
            }
          }

          setVerifying(false);
        } catch (error) {
          console.error("Error verifying premium access:", error);
          toast.error("Error verifying premium access");
          router.replace("/");
        }
      }
    };

    verifyPremiumAccess();
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading || verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div className="text-lg">Verifying premium access...</div>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'premium') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Premium Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              As a premium reseller, you have access to exclusive products, better margins, and priority support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Exclusive Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access to premium product catalog with exclusive items.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Priority Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    24/7 dedicated support for all your needs.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Advanced analytics and reporting tools.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}