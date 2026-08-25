import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    removeFromCart,
    clearCart,
} from "../features/addtoCart/cartSlice";

// MUI Icons
import StarIcon from "@mui/icons-material/Star";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

import Card from "../components/Card";
import { dummyCoursePricing } from "../constants/constants";

/**
 * Helper to safely extract pricing information from various course schemas.
 * Prevents NaN, undefined, or missing discount/originalPrice values.
 */
const getCoursePricing = (course) => {
    const rawPrice = course?.pricing?.price ?? course?.price;
    const rawOriginalPrice =
        course?.pricing?.originalPrice ?? course?.originalPrice;
    const rawDiscount = course?.pricing?.discount ?? course?.discount;

    const price =
        typeof rawPrice === "number" && !isNaN(rawPrice)
            ? rawPrice
            : Number(rawPrice) || dummyCoursePricing.price || 0;

    const originalPrice =
        typeof rawOriginalPrice === "number" && !isNaN(rawOriginalPrice)
            ? rawOriginalPrice
            : Number(rawOriginalPrice) || (dummyCoursePricing.originalPrice > price ? dummyCoursePricing.originalPrice : price);

    const discount =
        typeof rawDiscount === "number" && !isNaN(rawDiscount)
            ? rawDiscount
            : Number(rawDiscount) ||
            (originalPrice > price
                ? Math.round(((originalPrice - price) / originalPrice) * 100)
                : 0);

    return {
        price,
        originalPrice: originalPrice > price ? originalPrice : null,
        discount: discount > 0 ? discount : null,
    };
};

function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector((state) => state.cart?.items || []);

    const handleRemoveItem = (course) => {
        const courseId = course?.id || course?._id;
        if (!courseId) return;
        dispatch(removeFromCart(courseId));
        toast.info("Course removed from cart.");
    };

    const handleClearCart = () => {
        if (cartItems.length === 0) return;
        dispatch(clearCart());
        toast.info("Cart cleared.");
    };

    // Calculate subtotal, discount, and final total safely
    const subtotal = cartItems.reduce((acc, course) => {
        const { price, originalPrice } = getCoursePricing(course);
        return acc + (originalPrice || price);
    }, 0);

    const totalPrice = cartItems.reduce((acc, course) => {
        const { price } = getCoursePricing(course);
        return acc + price;
    }, 0);

    const totalDiscount = Math.max(0, subtotal - totalPrice);

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] w-full text-white flex items-center justify-center px-4 py-12">
                <div className="text-center max-w-md mx-auto flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#1E1E2A] border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                        <ShoppingCartOutlinedIcon
                            sx={{
                                fontSize: 44,
                                color: "#818CF8",
                            }}
                        />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold font-[Poppins] tracking-tight">
                        Your Cart is Empty
                    </h1>

                    <p className="text-gray-400 text-sm mt-3 leading-relaxed font-[Manrope]">
                        Looks like you haven&apos;t added any courses to your cart yet. Explore our catalog and discover top courses to boost your skills!
                    </p>

                    <button
                        onClick={() => navigate("/catalog")}
                        className="mt-8 px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#6366F1]/20 flex items-center gap-2 cursor-pointer"
                    >
                        <span>Browse Courses</span>
                        <ArrowForwardIcon sx={{ fontSize: 16 }} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white px-4 sm:px-6 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
            {/* Top Navigation */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate("/catalog")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                    <ArrowBackIcon fontSize="small" />
                    <span>Continue Shopping</span>
                </button>

                <button
                    onClick={handleClearCart}
                    className="text-xs text-red-400/80 hover:text-red-300 transition-colors font-medium cursor-pointer"
                >
                    Clear All
                </button>
            </div>

            {/* Page Title */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-[Poppins] tracking-tight">
                    Shopping Cart
                </h1>
                <p className="text-gray-400 text-sm mt-1 font-[Manrope]">
                    {cartItems.length} {cartItems.length === 1 ? "course" : "courses"} ready for checkout
                </p>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                    {cartItems.map((course, index) => {
                        const courseId = course?.id || course?._id || index;
                        const { price, originalPrice, discount } = getCoursePricing(course);
                        const instructorName =
                            typeof course.instructor === "string"
                                ? course.instructor
                                : course.instructor?.name || "EduFlow Instructor";

                        return (
                            <Card
                                key={courseId}
                                className="p-4 sm:p-5 border border-gray-800 bg-[#1A1D24] rounded-2xl hover:border-gray-700 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                                    {/* Course Image */}
                                    <div
                                        onClick={() => navigate(`/courses/${courseId}`)}
                                        className="w-full sm:w-48 md:w-52 aspect-video sm:aspect-auto sm:h-32 rounded-xl overflow-hidden bg-gray-900 shrink-0 cursor-pointer group relative"
                                    >
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/40 to-slate-900 text-indigo-300 font-bold text-sm">
                                                EduFlow
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Information */}
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div>
                                            {/* Category & Level Badges */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {course.category && (
                                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md">
                                                        {course.category}
                                                    </span>
                                                )}
                                                {course.level && (
                                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-md">
                                                        {course.level}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title & Price Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                                <h2
                                                    onClick={() => navigate(`/courses/${courseId}`)}
                                                    className="text-base sm:text-lg font-bold text-white hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer font-[Poppins]"
                                                >
                                                    {course.title}
                                                </h2>

                                                {/* Price block */}
                                                <div className="text-left sm:text-right shrink-0 mt-1 sm:mt-0">
                                                    <div className="flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0.5">
                                                        <span className="text-lg sm:text-xl font-extrabold text-white font-[Poppins]">
                                                            ₹{price}
                                                        </span>
                                                        {originalPrice && (
                                                            <span className="text-xs text-gray-500 line-through">
                                                                ₹{originalPrice}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {discount && (
                                                        <span className="text-[11px] text-emerald-400 font-semibold inline-block">
                                                            {discount}% off
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Instructor */}
                                            <p className="text-xs text-gray-400 mt-1 font-[Manrope]">
                                                By {instructorName}
                                            </p>
                                        </div>

                                        {/* Footer Meta & Actions */}
                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                            {/* Rating & Duration */}
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                {course.rating && (
                                                    <div className="flex items-center gap-1">
                                                        <StarIcon sx={{ fontSize: 15, color: "#facc15" }} />
                                                        <span className="text-gray-200 font-semibold">
                                                            {course.rating}
                                                        </span>
                                                    </div>
                                                )}
                                                {course.duration && (
                                                    <div className="flex items-center gap-1">
                                                        <AccessTimeIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
                                                        <span>{course.duration}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(course)}
                                                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors p-1 rounded cursor-pointer font-medium"
                                                title="Remove from cart"
                                            >
                                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Order Summary Sticky Sidebar */}
                <div className="lg:col-span-4 w-full">
                    <Card className="p-6 border border-gray-800 bg-[#1A1D24] rounded-2xl shadow-2xl lg:sticky lg:top-24">
                        <h2 className="text-xl font-bold text-white font-[Poppins] mb-5">
                            Order Summary
                        </h2>

                        <div className="space-y-3.5 text-sm font-[Manrope]">
                            <div className="flex justify-between items-center text-gray-400">
                                <span>Selected Courses</span>
                                <span className="text-white font-medium">
                                    {cartItems.length}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-gray-400">
                                <span>Original Price</span>
                                <span className="text-white font-medium">
                                    ₹{subtotal}
                                </span>
                            </div>

                            {totalDiscount > 0 && (
                                <div className="flex justify-between items-center text-emerald-400">
                                    <span>Discount Savings</span>
                                    <span className="font-semibold">
                                        -₹{totalDiscount}
                                    </span>
                                </div>
                            )}

                            <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                                <span className="text-base font-bold text-white">
                                    Total Amount
                                </span>
                                <span className="text-2xl font-extrabold text-white font-[Poppins]">
                                    ₹{totalPrice}
                                </span>
                            </div>
                        </div>

                        {/* Checkout CTA */}
                        <button
                            onClick={() => navigate("/payment-processing")}
                            className="w-full mt-6 py-3.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#6366F1]/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <LockOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Proceed to Checkout</span>
                        </button>

                        {/* Trust Badges */}
                        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2 text-[11px] text-gray-400 font-[Manrope]">
                            <div className="flex items-center gap-2">
                                <VerifiedUserOutlinedIcon sx={{ fontSize: 15, color: "#60A5FA" }} />
                                <span>Secure 256-bit SSL encrypted payment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AccessTimeIcon sx={{ fontSize: 15, color: "#34D399" }} />
                                <span>Instant course access upon completion</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Cart;