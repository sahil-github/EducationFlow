import Button from '../../components/Button';
import Logo from '../../assets/logo/Logo.png';
import Checkbox from '@mui/material/Checkbox';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GoogleIcon from "../../assets/icons/googleicon.png";
import AppleIcon from "../../assets/icons/applelogo.png";
import LinkedInIcon from "../../assets/icons/LinkedIn.png";
import { useEffect } from 'react';
import Input from "../../components/Inputs";
import { useFormik } from "formik";
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, socialLoginUser } from '../../features/auth/authThunks';
import { clearError } from '../../features/auth/authSlice';
import { getProfile } from '../../features/profile/profileThunks';

// ---------------------------------------------------------------------------
// Resolve the post-login destination using backend profile fields.
//   isOnboarded   → true  : go to Dashboard
//   isOnboarded   → false : resume from onboardingStep
// ---------------------------------------------------------------------------
function resolvePostLoginRoute(profileData) {
    const profile = profileData?.data ?? profileData;
    if (!profile) return "/personal-info";
    if (profile.isOnboarded === true || profile.isOnboarded === "true") return "/dashboard";

    const step = profile.onboardingStep;
    switch (step) {
        case 1:
            return "/personal-info";
        case 2:
            return "/interests";
        case 3:
            return "/learning-goals";
        case 4:
            return "/skill-assessment";
        case 5:
            return "/review";
        default:
            return "/personal-info";
    }
}

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const handleSocialLogin = async (provider, providerToken = "oauth_token_from_google_sdk") => {
        try {
            // TODO: Replace providerToken with real SDK token from Google/Apple/LinkedIn
            await dispatch(socialLoginUser({ provider, providerToken })).unwrap();

            // Fetch profile to determine onboarding status
            const profileResult = await dispatch(getProfile()).unwrap();
            if (profileResult) {
                dispatch(updateUser(profileResult));
            }
            toast.success(`${provider} Login successful!`);
            navigate(resolvePostLoginRoute(profileResult));
        } catch (err) {
            const msg = typeof err === "string" ? err : err?.message || `${provider} login failed`;
            toast.error(msg);
        }
    };

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
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
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                await dispatch(loginUser({
                    email: values.email,
                    password: values.password,
                    rememberMe: values.rememberMe,
                })).unwrap();

                // Use backend profile as the single source of truth for onboarding status
                const profileResult = await dispatch(getProfile()).unwrap();
                if (profileResult) {
                    dispatch(updateUser(profileResult));
                }
                toast.success("Login successful!");
                navigate(resolvePostLoginRoute(profileResult));
            } catch (err) {
                // err may be a plain string or a typed object { type, message }
                const errorMsg = typeof err === "string"
                    ? err
                    : err?.message || "Login failed";

                toast.error(errorMsg);

                // USER_NOT_FOUND → redirect to signup after a brief delay
                if (err?.type === "USER_NOT_FOUND" ||
                    errorMsg.toLowerCase().includes("not found") ||
                    errorMsg.toLowerCase().includes("sign up")) {
                    setTimeout(() => navigate("/signup"), 1200);
                }
            }
        },
    });

    return (
        <div className="min-h-screen bg-cover bg-center text-white flex flex-col justify-between">

            {/* <nav className="sticky top-0 shadow-md z-50  bg-[#18181C]"> */}
            {/* Header */}
            {/* <header className=" px-6 md:px-10 py-3 flex items-center gap-2"> */}
            <div className="absolute top-6 left-6 md:top-8 md:left-10 flex items-center gap-3 z-10">
                <img src={Logo} alt='Logo' className='w-10 h-10' />
                <span className="font-bold text-lg tracking-wide font-[Poppins] text-[#6366F1]">EduFlow</span>
            </div>
            {/* </header>
            </nav> */}

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center justify-items-center">

                    <div
                        className="w-full max-w-sm mx-auto bg-[#1E1E24]/90 backdrop-blur-md border border-white/10
                        rounded-3xl
                        p-4 sm:p-6
                        min-h-[24rem]
                        shadow-2xl
                        flex flex-col
                        gap-4
                        "  >

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
                    <div className="w-full max-w-[390px] flex flex-col gap-2">
                        {/* Right Card - Login Form */}
                        <div className="w-full bg-[#18181C] border border-white/5 rounded-[24px] p-6 md:p-6 shadow-2xl">
                            <h2 className="text-white font-semibold text-xl md:text-2xl font-[Poppins] tracking-tight mb-1.5">
                                Welcome Back
                            </h2>
                            <p className="text-[#71717A] text-xs font-[Manrope] mb-3">
                                Please enter your details to sign in.
                            </p>


                            <div className="flex flex-col gap-2.5 mb-3">

                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin('Google')}
                                    disabled={loading}
                                    className="w-full h-8 flex items-center justify-center gap-2.5 bg-[#22222A] hover:bg-[#2A2A34] text-white text-xs font-semibold font-[Manrope] rounded-full border border-white/10 transition-all duration-200 cursor-pointer disabled:opacity-50"
                                >
                                    <img src={GoogleIcon} alt="Google" className="w-3.5 h-3.5" />
                                    Log in with Google
                                </button>


                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin('Apple')}
                                    disabled={loading}
                                    className="w-full h-8 flex items-center justify-center gap-2.5 bg-white hover:bg-gray-100 text-black text-xs font-semibold font-[Manrope] rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50"
                                >
                                    <img src={AppleIcon} alt="Apple" className="w-3.5 h-3.5" />
                                    Log in with Apple
                                </button>


                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin('LinkedIn')}
                                    disabled={loading}
                                    className="w-full h-8 flex items-center justify-center gap-2.5 bg-[#0077B5] hover:bg-[#00669C] text-white text-xs font-semibold font-[Manrope] rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50"
                                >
                                    <img src={LinkedInIcon} alt="LinkedIn" className="w-3.5 h-3.5" />
                                    Log in with LinkedIn
                                </button>
                            </div>

                            {/* OR Divider */}
                            <div className="flex items-center gap-2 mb-2">
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
                                        <NavLink to="/forgot-password">
                                            <span className="text-[#6366F1] text-[11px] font-[Manrope] font-medium cursor-pointer hover:text-[#4F46E5] transition-colors">
                                                Forgot password?
                                            </span>
                                        </NavLink>
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
                                {/* <div className="flex items-center gap-1 -ml-2">
                                    <Checkbox
                                        size="small"
                                        checked={formik.values.rememberMe}
                                        onChange={(e) => formik.setFieldValue('rememberMe', e.target.checked)}
                                        sx={{
                                            color: 'rgba(255,255,255,0.2)',
                                            '&.Mui-checked': { color: '#6366F1' },
                                            padding: '2px',
                                        }}
                                    />
                                    <span className="text-[#A1A1AA] text-xs font-[Manrope]">
                                        Remember for 30 days
                                    </span>
                                </div> */}

                                {/* Sign In Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={loading}
                                    className="w-full h-8 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] !py-2 text-xs"
                                >
                                    {loading ? "Logging In..." : "Log In"}
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
                        <footer className="w-full flex flex-col sm:flex-row justify-between items-center gap-2 px-1 text-[10px] font-[Manrope] text-[#52525B] text-center sm:text-left">
                            <span>© 2024 EduFlow Inc.</span>
                            <div className="flex flex-wrap justify-center gap-4">
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