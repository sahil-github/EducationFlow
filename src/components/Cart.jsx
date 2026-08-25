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

function Cart() {
    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                My Cart
            </h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-4">

                    {cartItems.map((course) => (
                        <div
                            key={course.id}
                            className="border p-4 rounded-lg"
                        >

                            <h2 className="text-xl font-bold">
                                {course.title}
                            </h2>

                            <p className="text-gray-500">
                                {course.description}
                            </p>

                            <p className="font-bold mt-2">
                                ₹{course.price}
                            </p>

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
                    ))}

                    <button
                        onClick={() => dispatch(clearCart())}
                        className="px-4 py-2 bg-gray-800 text-white rounded"
                    >
                        Clear Cart
                    </button>

                </div>
            )}

        </div>
    );
}

export default Cart;