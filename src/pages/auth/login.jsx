
import Button from '../../components/Button';
import Logo from '../../assets/logo/Logo.png';
import Checkbox from '@mui/material/Checkbox';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GoogleIcon from "../../assets/icons/googleicon.png";
import AppleIcon from "../../assets/icons/applelogo.png";
import LinkedInIcon from "../../assets/icons/LinkedIn.png";
import { useState, useEffect } from 'react';
import Input from "../../components/Inputs";
import { useFormik } from "formik";
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveUsers, getUsers, saveCurrentUser, getCurrentUser } from '../../utils/store';
function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser()
        if (currentUser && currentUser.email) {
            navigate('/home');
        }
    }, [navigate]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate: (values) => {
            const errors = {};

            if (!values.email) {
                errors.email = 'Email is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Please enter a valid email address';
            }

            if (!values.password) {
                errors.password = 'Password is required';
            } else if (values.password.length < 8) {
                errors.password = 'Password must be at least 8 characters';
            } else if (!values.password.includes('@')) {
                errors.password = 'Password must contain the special character @';
            }

            return errors;
        },
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const Users = getUsers()    
                const matchedUser = Users.find(u => u.email === values.email && u.password === values.password);
                if (!matchedUser) {
                    toast.error("Invalid email or password. Please try again or Signup.");
                    return;
                }

                // Create a copy and remove password before saving to session
                const sanitizedUser = { ...matchedUser };
                delete sanitizedUser.password;

                saveCurrentUser(sanitizedUser);
                navigate("/home");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div
            className="min-h-screen bg-cover bg-center text-white flex flex-col justify-between"
        >

            <nav className="sticky top-0 shadow-md z-50  bg-[#18181C]">
                {/* Header */}
                <header className=" px-6 md:px-10 py-3 flex items-center gap-2">
                    <img src={Logo} alt='Logo' className='w-10 h-10' />
                    <span className="font-bold text-lg tracking-wide font-[Poppins] text-[#6366F1]">EduFlow</span>
                </header>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center justify-items-center">

                    <div className="w-full max-w-full md:max-w-sm bg-[#1E1E24]/90 backdrop-blur-md border border-white/10 rounded-4xl p-6 md:p-6 h-96 shadow-2xl flex flex-col justify-start gap-4">

                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 border border-white/10">
                            <AutoAwesomeIcon sx={{ fontSize: 20, color: '#CBD5E1' }} />
                        </div>

                        <h1 className="text-white font-bold text-2xl md:text-3xl sm:text-xl font-[Poppins] leading-tight tracking-tight mb-3">
                            Unleash your <br />visionary potential.
                        </h1>

                        <p className="text-[#94A3B8] font-[Manrope] text-xs md:text-sm  leading-relaxed ">
                            Experience a high-end educational journey where academic rigor meets
                            cutting-edge digital aesthetics. EduFlow bridges the gap between
                            learning and doing.
                        </p>

                        <div className="flex gap-4  ">
                            <div>
                                <span className="block text-white text-lg md:text-sm font-semibold font-[Poppins]">15k+</span>
                                <span className="text-[#64748B] text-[10px] md:text-xs font-[Poppins] mt-0.5 block">Active Learners</span>
                            </div>
                            <div>
                                <span className="block text-white text-lg md:text-sm font-semibold font-[Poppins]">98%</span>
                                <span className="text-[#64748B] text-[10px] md:text-xs font-[Poppins]  block">Success Rate</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Card + Footer) */}
                    <div className="w-full max-w-[390px] flex flex-col gap-5">
                        {/* Right Card - Login Form */}
                        <div className="w-full bg-[#18181C] border border-white/5 rounded-[24px] p-6 md:p-6 shadow-2xl">
                            <h2 className="text-white font-semibold text-xl md:text-2xl font-[Poppins] tracking-tight mb-1.5">
                                Welcome Back
                            </h2>
                            <p className="text-[#71717A] text-xs font-[Manrope] mb-6">
                                Please enter your details to sign in.
                            </p>


                            <div className="flex flex-col gap-2.5 mb-3">

                                <button
                                    type="button"
                                    className="w-full h-10 flex items-center justify-center gap-2.5 bg-[#22222A] hover:bg-[#2A2A34] text-white text-xs font-semibold font-[Manrope] rounded-full border border-white/10 transition-all duration-200 cursor-pointer"
                                >
                                    <img src={GoogleIcon} alt="Google" className="w-3.5 h-3.5" />
                                    Log in with Google
                                </button>


                                <button
                                    type="button"
                                    className="w-full h-10 flex items-center justify-center gap-2.5 bg-white hover:bg-gray-100 text-black text-xs font-semibold font-[Manrope] rounded-full transition-all duration-200 cursor-pointer"
                                >
                                    <img src={AppleIcon} alt="Apple" className="w-3.5 h-3.5" />
                                    Log in with Apple
                                </button>


                                <button
                                    type="button"
                                    className="w-full h-10 flex items-center justify-center gap-2.5 bg-[#0077B5] hover:bg-[#00669C] text-white text-xs font-semibold font-[Manrope] rounded-full transition-all duration-200 cursor-pointer"
                                >
                                    <img src={LinkedInIcon} alt="LinkedIn" className="w-3.5 h-3.5" />
                                    Log in with LinkedIn
                                </button>
                            </div>

                            {/* OR Divider */}
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-[#52525B] text-[10px] font-[Manrope] tracking-widest">OR</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Form */}
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

                                {/* Password */}
                                <Input

                                    label="Password"
                                    rightElement={
                                        <span
                                            className="text-[#6366F1] text-[11px] font-[Manrope] font-medium cursor-pointer hover:text-[#4F46E5] transition-colors"
                                        >
                                            Forgot password?
                                        </span>
                                    }
                                    type="password"
                                    placeholder="••••••••"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && formik.errors.password}
                                    size="small"
                                />

                                {/* Remember Checkbox */}
                                <div className="flex items-center gap-1.5 -ml-2">
                                    <Checkbox
                                        size="small"
                                        checked={formik.values.remember || false}
                                        onChange={(e) => formik.setFieldValue('remember', e.target.checked)}
                                        sx={{
                                            color: 'rgba(255,255,255,0.2)',
                                            '&.Mui-checked': { color: '#6366F1' },
                                            padding: '4px',
                                        }}
                                    />
                                    <span className="text-[#A1A1AA] text-xs font-[Manrope]">
                                        Remember for 30 days
                                    </span>
                                </div>

                                {/* Sign In Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                    className="w-full h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] !py-2 text-xs"
                                >
                                    {isLoading ? "Loging In..." : "Log In"}
                                </Button>

                                {/* Sign Up Link */}
                                <p className="text-center text-[#A1A1AA] text-xs font-[Manrope]">
                                    Don't have an account?{' '}
                                    <NavLink to="/signup">
                                        <span className="text-[#6366F1] font-medium cursor-pointer hover:text-[#4F46E5] transition-colors">
                                            Sign up for free
                                        </span>
                                    </NavLink>
                                </p>
                            </form>
                        </div>

                        {/* Footer directly below the Right Card */}
                        <footer className="w-full flex flex-row justify-between items-center px-1 text-[11px] font-[Manrope] text-[#52525B]">
                            <span>© 2024 EduFlow Inc.</span>
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:text-[#A1A1AA] transition-colors">Privacy Policy</span>
                                <span className="cursor-pointer hover:text-[#A1A1AA] transition-colors">Terms of Service</span>
                                <span className="cursor-pointer hover:text-[#A1A1AA] transition-colors">Cookie Settings</span>
                            </div>
                        </footer>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Login;