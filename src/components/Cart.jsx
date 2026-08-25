// import { useSelector, useDispatch } from "react-redux";
// import { addToCart, removeFromCart, clearCart } from "../features/addtoCart/cartSlice";

// function Cart() {
//     const dispatch = useDispatch();
//     const cartItems = useSelector(
//         (state) => state.cart.items
//     );

//     return (
//         <div >

//            <button onClick={() => dispatch(addToCart())}>Add</button>
//             <button onClick={() => dispatch(removeFromCart())}>Remove</button>
//             <button onClick={() => dispatch(clearCart())}>Clear</button>
//         </div>
//     );
// }

// export default Cart;
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../features/addtoCart/cartSlice";
import Card from '../components/Card'
import StarIcon from "@mui/icons-material/Star";
import { dummyCoursePricing } from "../constants/constants";
function Cart() {
    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const pricing =
        dummyCoursePricing;

    const { courses } = useSelector((state) => state.courses);

    return (
        // <div className="p-6">

        //     <h1 className="text-2xl font-bold mb-6">
        //         My Cart
        //     </h1>

        //     {cartItems.length === 0 ? (
        //         <p>Your cart is empty.</p>
        //     ) : (
        //         <div className="space-y-4">

        //             {cartItems.map((course) => (
        //                 <div
        //                     key={course.id}
        //                     className="border p-4 rounded-lg"
        //                 >

        //                     <h2 className="text-xl font-bold">
        //                         {course.title}
        //                     </h2>

        //                     <p className="text-gray-500">
        //                         {course.description}
        //                     </p>

        //                     <p className="font-bold mt-2">
        //                         ₹{course.price}
        //                     </p>



        //         </div>
        //     )}

        // </div>
        <Card className="p-6 border border-gray-800 bg-[#1A1D24] space-y-5 shadow-2xl lg:sticky lg:top-24">

            {/* COURSE IMAGE */}

            <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 flex items-center justify-center shadow-inner border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <h2 className="text-white/10 text-4xl font-extrabold select-none absolute">
                    EduFlow
                </h2>

                {courses?.thumbnail && (
                    <img
                        src={courses.thumbnail}
                        alt={
                            courses?.title ||
                            "Course Thumbnail"
                        }
                        className="w-full h-full object-cover relative z-10"
                        onError={(e) => {
                            e.target.style.display =
                                "none";
                        }}
                    />
                )}
                {courses?.rating != null && (
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1 border border-white/10 z-20">
                        <StarIcon
                            sx={{
                                fontSize: 14,
                                color: "#facc15",
                            }}
                        />
                        <span className="text-white text-xs font-bold">
                            {courses.rating ||
                                "0.0"}
                        </span>
                    </div>
                )}
            </div>


            {/* COURSE INFO */}

            <div className="space-y-4">
                {/* <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                    <span className="text-gray-400">
                        Instructor
                    </span>
                    <span className="text-white font-semibold text-right">
                        {
                            instructorData.name
                        }
                    </span>
                </div> */}


                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                    <span className="text-gray-400">
                        Difficulty
                    </span>
                    <span className="text-white font-semibold">
                        {courses.level}
                    </span>
                </div>


                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                        Total Duration
                    </span>
                    <span className="text-white font-semibold">
                        {courses.duration}
                    </span>
                </div>

                <div className="border-t border-white/5 pt-5">
                    <div className="flex items-end gap-3">
                        {/* Current Price */}
                        <span className="text-3xl font-extrabold text-white">
                            ₹{pricing.price}
                        </span>

                        {/* Original Price */}
                        {pricing.originalPrice && (
                            <span className="text-sm text-gray-500 line-through mb-1">
                                ₹{pricing.originalPrice}
                            </span>
                        )}

                        {/* Discount */}
                        {pricing.discount && (
                            <span className="text-sm text-green-400 font-semibold mb-1">
                                {pricing.discount}% off
                            </span>
                        )}
                    </div>
                    {/* Pricing Message */}
                    <p className="text-xs text-gray-500 mt-2">
                        Get full access to this course and start learning today.
                    </p>
                </div>
            </div>
            <div>
                <button
                    onClick={() =>
                        dispatch(
                            removeFromCart(course.id)
                        )
                    }
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded"
                >
                    Remove
                </button>

            </div>


            <button
                onClick={() => dispatch(clearCart())}
                className="px-4 py-2 bg-gray-800 text-white rounded"
            >
                Clear Cart
            </button>
        </Card >


    );
}

export default Cart;