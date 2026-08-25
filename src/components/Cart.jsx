import { useDispatch, useSelector } from "react-redux";
import {
    removeFromCart,
    clearCart,
} from "../features/addtoCart/cartSlice";

import StarIcon from "@mui/icons-material/Star";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import Card from "../components/Card";
import { dummyCoursePricing } from "../constants/constants";

function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 👇 THIS IS THE DATA ADDED FROM ADD TO CART
    const cartItems = useSelector(
        (state) => state.cart.items
    );

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen text-white flex items-center justify-center p-6">
                <div className="text-center">

                    <ShoppingCartOutlinedIcon
                        sx={{
                            fontSize: 80,
                            color: "#6b7280",
                        }}
                    />

                    <h1 className="text-2xl font-bold mt-5">
                        Your Cart is Empty
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Add a course to your cart and start learning.
                    </p>

                    <button
                        onClick={() => navigate("/catalog")}
                        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold"
                    >
                        Browse Courses
                    </button>

                </div>
            </div>
        );
    }

    // Total price
    const totalPrice = cartItems.reduce(
        (total, course) =>
            total + Number(
                course?.pricing?.price ??
                dummyCoursePricing.price ??
                0
            ),
        0
    );

    return (
        <div className="min-h-screen text-white p-4 md:p-8">

            {/* HEADER */}

            <div className="max-w-7xl mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                >
                    <ArrowBackIcon fontSize="small" />
                    Continue Shopping
                </button>

                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h1 className="text-3xl font-extrabold">
                            My Cart
                        </h1>

                        <p className="text-gray-400 mt-2">
                            {cartItems.length}{" "}
                            {cartItems.length === 1
                                ? "course"
                                : "courses"}{" "}
                            in your cart
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            dispatch(clearCart())
                        }
                        className="text-sm text-red-400 hover:text-red-300"
                    >
                        Clear Cart
                    </button>

                </div>


                {/* MAIN CONTENT */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* CART ITEMS */}

                    <div className="lg:col-span-2 space-y-4">

                        {cartItems.map((course) => {

                            const price =
                                course?.pricing?.price ??
                                dummyCoursePricing.price;

                            return (
                                <Card
                                    key={course.id}
                                    className="p-4 md:p-5 border border-gray-800 bg-[#1A1D24]"
                                >

                                    <div className="flex flex-col sm:flex-row gap-5">

                                        {/* IMAGE */}

                                        <div className="w-full sm:w-52 h-32 rounded-lg overflow-hidden bg-gray-900 shrink-0">

                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    EduFlow
                                                </div>
                                            )}

                                        </div>


                                        {/* COURSE DETAILS */}

                                        <div className="flex-1">

                                            <div className="flex justify-between gap-4">

                                                <div>

                                                    <span className="text-xs text-blue-400 font-semibold">
                                                        {course.category}
                                                    </span>

                                                    <h2 className="text-lg font-bold text-white mt-1">
                                                        {course.title}
                                                    </h2>

                                                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                                                        {course.description}
                                                    </p>

                                                </div>

                                                {/* PRICE */}

                                                <div className="text-right shrink-0">

                                                    <p className="text-xl font-bold text-white">
                                                        ₹{price}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* COURSE META */}

                                            <div className="flex flex-wrap items-center gap-4 mt-4">

                                                {course.rating && (
                                                    <div className="flex items-center gap-1">

                                                        <StarIcon
                                                            sx={{
                                                                fontSize: 16,
                                                                color: "#facc15",
                                                            }}
                                                        />

                                                        <span className="text-sm text-gray-300">
                                                            {course.rating}
                                                        </span>

                                                    </div>
                                                )}

                                                {course.level && (
                                                    <span className="text-xs text-gray-400">
                                                        Level:{" "}
                                                        <span className="text-gray-200">
                                                            {course.level}
                                                        </span>
                                                    </span>
                                                )}

                                                {course.duration && (
                                                    <span className="text-xs text-gray-400">
                                                        {course.duration}
                                                    </span>
                                                )}

                                            </div>


                                            {/* REMOVE */}

                                            <button
                                                onClick={() =>
                                                    dispatch(
                                                        removeFromCart(
                                                            course.id
                                                        )
                                                    )
                                                }
                                                className="flex items-center gap-2 mt-4 text-sm text-red-400 hover:text-red-300"
                                            >

                                                <DeleteOutlineIcon
                                                    fontSize="small"
                                                />

                                                Remove

                                            </button>

                                        </div>

                                    </div>

                                </Card>
                            );
                        })}

                    </div>


                    {/* ORDER SUMMARY */}

                    <div>

                        <Card className="p-6 border border-gray-800 bg-[#1A1D24] lg:sticky lg:top-24">

                            <h2 className="text-xl font-bold mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4">

                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-400">
                                        Courses
                                    </span>

                                    <span className="text-white">
                                        {cartItems.length}
                                    </span>

                                </div>

                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-400">
                                        Subtotal
                                    </span>

                                    <span className="text-white">
                                        ₹{totalPrice}
                                    </span>

                                </div>

                                <div className="border-t border-gray-800 pt-4 flex justify-between">

                                    <span className="text-lg font-bold">
                                        Total
                                    </span>

                                    <span className="text-2xl font-extrabold text-white">
                                        ₹{totalPrice}
                                    </span>

                                </div>

                            </div>


                            {/* CHECKOUT */}

                            <button
                                onClick={() =>
                                    navigate("/payment-processing")
                                }
                                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition"
                            >
                                Proceed to Checkout
                            </button>


                            <p className="text-xs text-gray-500 text-center mt-4">
                                Secure checkout • Instant course access
                            </p>

                        </Card>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Cart;