import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function PackageCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planId = searchParams.get("plan") || "growth";
  const cycle = searchParams.get("cycle") || "monthly";

  // Plan pricing logic
  const isEnterprise = planId === "enterprise";
  const planName = isEnterprise ? "Enterprise Practice Tier" : "Growth Business Tier";
  const baseMonthly = isEnterprise ? (cycle === "annual" ? 399 : 499) : (cycle === "annual" ? 119 : 149);
  const vatAmount = Number((baseMonthly * 0.15).toFixed(2));
  const totalAmount = (baseMonthly + vatAmount).toFixed(2);

  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState<"card" | "eft">("card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("Capitec");
  const [processing, setProcessing] = useState(false);

  // Format card number with spaces (4444 4444 4444 4444)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Format expiry (MM/YY)
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleSimulatePayment = (e: FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "card") {
      if (!cardHolder.trim() || cardNumber.replace(/\s/g, "").length < 16 || expiry.length < 5 || cvv.length < 3) {
        toast.error("Please fill in valid card information.");
        return;
      }
    }

    setProcessing(true);

    // Simulate Payment Gateway 3D Secure Handshake (1.5 seconds)
    setTimeout(() => {
      setProcessing(false);
      toast.success("Payment authorized successfully!");
      navigate(
        `/dashboard/business/package/success?plan=${planId}&amount=${totalAmount}&ref=TXN-${Math.floor(
          100000 + Math.random() * 900000
        )}`
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/dashboard/business/package/plans" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
            <span>←</span> Cancel &amp; Choose Different Plan
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-emerald-600">🔒</span> 256-Bit SSL Encrypted Checkout
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Column: Payment Gateway Simulation */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Payment Gateway</h2>
            <p className="mt-1 text-xs text-slate-500">
              Select your payment method. (Demo Mode: Enter any placeholder data to authorize).
            </p>

            {/* Payment Method Tabs */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                  paymentMethod === "card"
                    ? "border-[#0EA5E9] bg-sky-50 text-[#0EA5E9] ring-2 ring-sky-100"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>💳</span> Credit / Debit Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("eft")}
                className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                  paymentMethod === "eft"
                    ? "border-[#0EA5E9] bg-sky-50 text-[#0EA5E9] ring-2 ring-sky-100"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>🏦</span> Instant EFT
              </button>
            </div>

            <form onSubmit={handleSimulatePayment} className="mt-8 space-y-4">
              {paymentMethod === "card" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Naledi Mokoena"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm font-mono tracking-wider text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        VISA / MC
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm font-mono text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm font-mono text-slate-800 outline-none transition focus:border-[#0EA5E9] focus:bg-white focus:ring-4 focus:ring-sky-100"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Instant EFT Selection */
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Select Your Bank
                  </label>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {["Capitec", "FNB", "Standard Bank", "Nedbank", "Absa", "Investec"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`rounded-xl border p-3 text-xs font-bold transition ${
                          selectedBank === bank
                            ? "border-[#0EA5E9] bg-sky-50 text-[#0EA5E9]"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    You will be directed to authenticate with {selectedBank} Instant EFT securely.
                  </p>
                </div>
              )}

              {/* Demo Mode Notice */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                ℹ️ <strong>Demo Environment:</strong> No real money will be charged. This sandbox validates gateway submission and immediately updates your subscription.
              </div>

              {/* Submit Payment Button */}
              <button
                type="submit"
                disabled={processing}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing Gateway Authorization...</span>
                  </>
                ) : (
                  <span>Authorize &amp; Pay R{totalAmount}</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>

              <div className="mt-4 border-b border-slate-100 pb-4">
                <div className="flex justify-between text-sm font-semibold text-slate-800">
                  <span>{planName}</span>
                  <span>R{baseMonthly}.00</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Billed {cycle === "annual" ? "annually (discounted)" : "monthly"}
                </p>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R{baseMonthly}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15% SA)</span>
                  <span>R{vatAmount}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-base font-extrabold text-slate-900">
                <span>Total Due Today</span>
                <span className="text-[#0EA5E9]">R{totalAmount}</span>
              </div>
            </div>

            {/* Plan Perks Reminder */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-xs text-slate-600 shadow-sm space-y-2.5">
              <h4 className="font-bold text-slate-900">Immediate Activation</h4>
              <p>✓ Instant expansion to {isEnterprise ? "Unlimited" : "15"} staff members.</p>
              <p>✓ Daily booking allowance set to {isEnterprise ? "Unlimited" : "20"} per staff member.</p>
              <p>✓ Cancel or adjust your subscription anytime from the dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}