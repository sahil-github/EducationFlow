import React from 'react';
import Button from '../../components/Button';
import Logo from '../../assets/logo/Logo.png';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Input from "../../components/Inputs";
import { useFormik } from "formik";
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { sendPasswordReset } from '../../features/Auth/authThunks';
import { clearError } from '../../features/Auth/authSlice';

function ForgotPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    React.useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Email is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Please enter a valid email address';
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                await dispatch(sendPasswordReset(values.email)).unwrap();
                toast.success("Password reset link sent to your email!");
                navigate("/login");
            } catch (err) {
                toast.error(err || "Failed to send reset email");
            }
        },
    });

    return (
        <div className="min-h-screen bg-cover bg-center text-white flex flex-col justify-between">
            <nav className="sticky top-0 shadow-md z-50 bg-[#18181C]">
                {/* Header */}
                <header className="px-6 md:px-10 py-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <img src={Logo} alt='Logo' className='w-10 h-10' />
                        <span className="font-bold text-lg tracking-wide font-[Poppins] text-[#6366F1]">EduFlow</span>
                    </div>
                    <span className="text-[#A1A1AA] text-xs font-[Manrope]">
                        Remembered your password?{' '}
                        <NavLink to="/login" className="text-[#6366F1] font-semibold hover:text-[#4F46E5] transition-colors ml-1">
                            Sign In
                        </NavLink>
                    </span>
                </header>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-[420px] flex flex-col gap-5">
                    {/* Forgot Password Form */}
                    <div className="w-full bg-[#18181C] border border-white/5 rounded-[24px] p-6 md:p-8 shadow-2xl">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 mx-auto">
                            <AutoAwesomeIcon sx={{ fontSize: 20, color: '#6366F1' }} />
                        </div>
                        
                        <h2 className="text-white font-semibold text-xl md:text-2xl font-[Poppins] tracking-tight mb-2 text-center">
                            Reset your password
                        </h2>
                        <p className="text-[#71717A] text-xs font-[Manrope] mb-6 text-center">
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-5">
                            {/* Email */}
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="name@company.com"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && formik.errors.email}
                                size="small"
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] !py-2 text-xs"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    </div>

                    <footer className="w-full flex flex-row justify-center items-center px-1 text-[11px] font-[Manrope] text-[#52525B]">
                        <span>© 2024 EduFlow Inc.</span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default ForgotPassword;
