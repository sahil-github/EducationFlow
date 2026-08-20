import React from 'react';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { formatSubscriptionPrice } from '../../utils/localizationUtils';

export default function SubscriptionPlanCard({ subscription, countryCode = "US", onChangePlan, onCancelSubscription }) {
    const planName = subscription?.planName || "EduFlow Pro Plan";
    const nextBillingDate = subscription?.nextBillingDate || "July 12, 2024";
    const priceText = subscription?.price || "$19.99 per month";
    const paymentMethod = subscription?.paymentMethod || "Visa ending in 4242";

    // Format subscription price according to country locale and exchange rate using Intl.NumberFormat
    const { priceAmount, pricePeriod } = formatSubscriptionPrice(priceText, countryCode);

    return (
        <div className="w-full bg-[#16171D]/90 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-5">
            {/* Plan Info & Pricing Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-white font-bold text-base font-[Poppins]">
                        {planName}
                    </h3>
                    <p className="text-[#94A3B8] text-xs font-[Manrope]">
                        Next billing date: <span className="text-white font-medium">{nextBillingDate}</span>
                    </p>
                </div>

                <div className="self-start sm:self-auto bg-[#1D61E7] text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 flex flex-col items-center justify-center">
                    <span className="font-bold text-sm font-[Poppins]">{priceAmount}</span>
                    <span className="text-[10px] text-blue-200 font-[Manrope]">{pricePeriod}</span>
                </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            {/* Features & Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-[Manrope]">
                <div className="flex flex-wrap items-center gap-4 text-[#94A3B8]">
                    <div className="flex items-center gap-1.5">
                        <CreditCardIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                        <span>{paymentMethod}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <VerifiedUserOutlinedIcon sx={{ fontSize: 16, color: '#34D399' }} />
                        <span>All features unlocked</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onChangePlan}
                        className="text-white hover:text-blue-400 font-semibold transition-colors cursor-pointer"
                    >
                        Change Plan
                    </button>
                    <span className="text-white/20">|</span>
                    <button
                        type="button"
                        onClick={onCancelSubscription}
                        className="text-[#F87171] hover:text-red-400 font-semibold transition-colors cursor-pointer"
                    >
                        Cancel Subscription
                    </button>
                </div>
            </div>
        </div>
    );
}
