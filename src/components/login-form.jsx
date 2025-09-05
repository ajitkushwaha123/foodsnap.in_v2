"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser, verifyOtp } from "@/helpers";
import Otp from "@/components/element/Otp";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: { phone: "", otp: "" },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^\+?\d{10,15}$/, "Enter a valid phone number")
        .required("Phone number is required"),
      otp: Yup.string().when([], {
        is: () => otpSent,
        then: (schema) =>
          schema.length(6, "OTP must be 6 digits").required("OTP is required"),
      }),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setServerError("");
        setSuccessMessage("");

        if (!otpSent) {
          const res = await registerUser(values.phone);
          if (!res.success) throw new Error(res.error);
          setOtpSent(true);
        } else {
          const res = await verifyOtp({ phone: values.phone, otp: values.otp });
          if (!res.success) throw new Error(res.error);

          setSuccessMessage("✅ Login successful! Redirecting you...");
          router.push("/");
        }
      } catch (err) {
        setServerError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  const showValidationError =
    formik.submitCount > 0 && Object.keys(formik.errors).length > 0;
  const errorMessage =
    serverError || (showValidationError ? Object.values(formik.errors)[0] : "");

  return (
    <div
      className={cn("flex flex-col items-center gap-8 px-4 sm:px-0", className)}
      {...props}
    >
      <div className="w-full max-w-sm">
        <Card className="shadow-xl border rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-xl font-bold">
              {otpSent ? "Verify OTP" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {otpSent
                ? "Enter the 6-digit code sent to your WhatsApp 📲"
                : "Sign in with your phone number. We'll send an OTP to your WhatsApp."}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={formik.handleSubmit} className="grid gap-6">
              {!otpSent ? (
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="font-semibold">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    disabled={loading}
                    className={cn(
                      "transition-all focus:ring-2 focus:ring-offset-1 focus:ring-primary",
                      formik.submitCount > 0 && formik.errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    )}
                  />
                </div>
              ) : (
                <div className="grid gap-6">
                  <Otp
                    value={formik.values.otp}
                    onChange={(val) => formik.setFieldValue("otp", val)}
                  />
                </div>
              )}

              {/* Error Message */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    key="error-bar"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <AlertCircle size={16} />
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    key="success-bar"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <CheckCircle2 size={16} />
                    {successMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={loading || (otpSent && formik.values.otp.length < 6)}
                className="flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {otpSent ? "Verifying..." : "Sending..."}
                  </>
                ) : otpSent ? (
                  "Verify OTP"
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
              <div>
                New here?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>
              <div className="text-xs">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms of Service
                </Link>{" "}
                &{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
