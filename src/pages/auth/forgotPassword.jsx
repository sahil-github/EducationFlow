import React from 'react';
import Button from '../../components/Button';
import Logo from '../../assets/logo/Logo.png';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Input from "../../components/Inputs";
import { useFormik } from "formik";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { sendPasswordReset } from '../../features/auth/authThunks';
import { clearResetError } from '../../features/auth/authSlice';
import { resetPassword } from '../../api/api';

function ForgotPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { resetLoading } = useSelector((state) => state.auth);

    React.useEffect(() => {
        dispatch(clearResetError());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            email: location.state?.email || '',
            retypePassword: '',
            newPassword: ''
        },
        validate: (values) => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Email is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Please enter a valid email address';
            }
            if (!values.retypePassword) {
                errors.retypePassword = 'Re-type password is required';
            }
            if (!values.newPassword) {
                errors.newPassword = 'New password is required';
            }
            if (values.retypePassword !== values.newPassword) {
                errors.retypePassword = 'Passwords do not match';
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                // First get the reset token
                const resetResponse = await dispatch(sendPasswordReset(values.email)).unwrap();
                const resetToken = resetResponse.resetToken || resetResponse.otp;

                if (!resetToken) {
                    throw new Error("Did not receive reset token from server");
                }

                // Then immediately reset the password
                await resetPassword({
                    email: values.email,
                    token: resetToken,
                    newPassword: values.newPassword
                });

                toast.success("Password changed successfully");
                navigate("/login");
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message || typeof err === 'string' ? err : "Failed to reset password";
                toast.error(msg);
            }
        },
    });

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden overflow-y-auto bg-cover bg-center text-white flex flex-col justify-between">
            <nav className="w-full bg-transparent">
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
            <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
                <div className="w-full max-w-[420px] flex flex-col gap-3">
                    {/* Forgot Password Form */}
                    <div className="w-full bg-[#18181C] border border-white/5 rounded-[24px] p-6 md:p-8 shadow-2xl">
                        {/* <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 mx-auto">
                            <AutoAwesomeIcon sx={{ fontSize: 20, color: '#6366F1' }} />
                        </div> */}

                        <h2 className="text-white font-semibold text-xl md:text-2xl font-[Poppins] tracking-tight mb-2 text-center">
                            Reset your password
                        </h2>
                        <p className="text-[#71717A] text-xs font-[Manrope] mb-6 text-center">
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
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

                            <Input
                                label="New password"
                                type="password"
                                placeholder="New password"
                                name="newPassword"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.newPassword && formik.errors.newPassword}
                                size="small"

                            />
                            <Input
                                label="Re-type password"
                                type="password"
                                placeholder="Re-type password"
                                name="retypePassword"
                                value={formik.values.retypePassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.retypePassword && formik.errors.retypePassword}
                                size="small"

                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={resetLoading}
                                className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] !py-2 text-xs"
                            >
                                {resetLoading ? "Sending..." : "Submit"}
                            </Button>
                        </form>
                    </div>

                    <footer className="w-full flex flex-row justify-center items-center px-1 text-[11px] font-[Manrope] text-[#52525B]">
                        <span>© 2026 EduFlow Inc.</span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default ForgotPassword;
