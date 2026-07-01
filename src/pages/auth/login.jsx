// import React, { useState } from 'react';
// import { useNavigate, NavLink } from 'react-router-dom';
// import { useFormik } from 'formik';
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// import Checkbox from '@mui/material/Checkbox';
import Button from '../../components/Button';
// import Input from '../../components/Inputs';
import Logo from '../../assets/logo/Logo.png';
// import GoogleIcon from '../../assets/icons/googleicon.png';
// import AppleIcon from '../../assets/icons/applelogo.png';
// import LinkedInIcon from '../../assets/icons/LinkedIn.png';

// function Login() {
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);

//     const formik = useFormik({
//         initialValues: {
//             email: '',
//             password: '',
//             rememberMe: false,
//         },
//         validate: (values) => {
//             const errors = {};
//             if (!values.email) {
//                 errors.email = 'Email is required';
//             } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
//                 errors.email = 'Please enter a valid email address';
//             }
//             if (!values.password) {
//                 errors.password = 'Password is required';
//             }
//             return errors;
//         },
//         onSubmit: (values) => {
//             setIsLoading(true);
//             setTimeout(() => {
//                 setIsLoading(false);
//                 navigate('/home');
//             }, 1000);
//         },
//     });

//     return (
//         <div className="min-h-screen text-white flex flex-col justify-between">
//             {/* Header */}
//             <header className="px-6 md:px-10 py-4 flex items-center gap-2">
//                 <img src={Logo} alt="Logo" className="w-10 h-10" />
//                 <span className="font-bold text-lg tracking-wide font-[Poppins] text-[#6366F1]">EduFlow</span>
//             </header>

//             {/* Main Content */}
//             <main className="flex-1 flex items-center justify-center px-4 py-8">
//                 <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-items-center">

//                     {/* Left side card */}
//                     <div className="w-full max-w-[390px] bg-[#1E1E24]/90 backdrop-blur-md border border-white/10 rounded-[24px] p-6 shadow-2xl flex flex-col justify-start gap-6">
//                         <div>
//                             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 border border-white/10">
//                                 <AutoAwesomeIcon sx={{ fontSize: 20, color: '#CBD5E1' }} />
//                             </div>

//                             <h1 className="text-white font-bold text-2xl md:text-3xl font-[Poppins] leading-tight tracking-tight mb-3">
//                                 Unleash your<br />visionary potential.
//                             </h1>

//                             <p className="text-[#94A3B8] font-[Manrope] text-xs md:text-sm leading-relaxed mb-2">
//                                 Experience a high-end educational journey where academic rigor meets
//                                 cutting-edge digital aesthetics. EduFlow bridges the gap between
//                                 learning and doing.
//                             </p>
//                             <div className="flex gap-8 pt-2  ">
//                                 <div>
//                                     <span className="block text-white text-lg md:text-lg font-semibold font-[Poppins]">15k+</span>
//                                     <span className="text-[#64748B] text-[10px] md:text-xs font-[Poppins] mt-0.5 block">Active Learners</span>
//                                 </div>
//                                 <div>
//                                     <span className="block text-white text-lg md:text-lg font-semibold font-[Poppins]">98%</span>
//                                     <span className="text-[#64748B] text-[10px] md:text-xs font-[Poppins] mt-0.5 block">Success Rate</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right side form */}
//                     <div className="w-full max-w-[420px] flex flex-col">
//                         <div className="bg-[#1E1E24]/80 backdrop-blur-md border border-white/10 rounded-[24px] p-6 md:p-8 shadow-2xl">
//                             <h2 className="text-white font-semibold text-xl md:text-2xl font-[Poppins] tracking-tight mb-1.5">
//                                 Welcome Back
//                             </h2>
//                             <p className="text-[#71717A] text-xs font-[Manrope] mb-6">
//                                 Please enter your details to sign in.
//                             </p>


//                             <div className="flex flex-col gap-2.5 mb-3">

//                                 <button
//                                     type="button"
//                                     className="w-full h-10 flex items-center justify-center gap-2.5 bg-[#22222A] hover:bg-[#2A2A34] text-white text-xs font-semibold font-[Manrope] rounded-full border border-white/10 transition-all duration-200 cursor-pointer"
//                                 >
//                                     <img src={GoogleIcon} alt="Google" className="w-3.5 h-3.5" />
//                                     Log in with Google
//                                 </button>


//                                 <button
//                                     type="button"
//                                     className="w-full h-10 flex items-center justify-center gap-2.5 bg-white hover:bg-gray-100 text-black text-xs font-semibold font-[Manrope] rounded-full transition-all duration-200 cursor-pointer"
//                                 >
//                                     <img src={AppleIcon} alt="Apple" className="w-3.5 h-3.5" />
//                                     Log in with Apple
//                                 </button>


//                                 <button
//                                     type="button"
//                                     className="w-full h-10 flex items-center justify-center gap-2.5 bg-[#0077B5] hover:bg-[#00669C] text-white text-xs font-semibold font-[Manrope] rounded-full transition-all duration-200 cursor-pointer"
//                                 >
//                                     <img src={LinkedInIcon} alt="LinkedIn" className="w-3.5 h-3.5" />
//                                     Log in with LinkedIn
//                                 </button>
//                             </div>

//                             {/* OR Divider */}
//                             <div className="flex items-center gap-2.5 mb-2">
//                                 <div className="flex-1 h-px bg-white/10" />
//                                 <span className="text-[#52525B] text-[10px] font-[Manrope] tracking-widest">OR</span>
//                                 <div className="flex-1 h-px bg-white/10" />
//                             </div>

//                             <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4">
//                                 <Input
//                                     size="small"
//                                     label="Email"
//                                     type="email"
//                                     placeholder="alex@example.com"
//                                     name="email"
//                                     value={formik.values.email}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     error={formik.touched.email && formik.errors.email}
//                                 />

//                                 <Input
//                                     size="small"
//                                     label="Password"
//                                     type="password"
//                                     placeholder="••••••••"
//                                     name="password"
//                                     value={formik.values.password}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     error={formik.touched.password && formik.errors.password}
//                                     rightElement={
//                                         <span className="text-[#6366F1] text-xs font-semibold cursor-pointer hover:text-[#4F46E5] transition-colors font-[Manrope]">
//                                             Forgot password?
//                                         </span>
//                                     }
//                                 />

//                                 <div className="flex items-center justify-between -mt-1">
//                                     <label className="flex items-center gap-1.5 text-xs text-slate-400 font-[Manrope] cursor-pointer">
//                                         <Checkbox
//                                             size="small"
//                                             name="rememberMe"
//                                             checked={formik.values.rememberMe}
//                                             onChange={formik.handleChange}
//                                             sx={{
//                                                 color: 'rgba(255,255,255,0.2)',
//                                                 '&.Mui-checked': { color: '#6366F1' },
//                                                 padding: '4px',
//                                             }}
//                                         />
//                                         Remember me
//                                     </label>
//                                 </div>

//                                 <Button
//                                     type="submit"
//                                     variant="primary"
//                                     disabled={isLoading}
//                                     className="w-full h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] text-xs"
//                                 >
//                                     {isLoading ? 'Signing In...' : 'Sign In'}
//                                 </Button>

//                                 <div className="flex items-center my-2">
//                                     <div className="flex-1 border-t border-white/10"></div>
//                                     <span className="px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider font-[Manrope]">Or continue with</span>
//                                     <div className="flex-1 border-t border-white/10"></div>
//                                 </div>



//                                 <p className="text-center text-[#A1A1AA] text-xs font-[Manrope] mt-2">
//                                     Don't have an account?{' '}
//                                     <NavLink to="/signup">
//                                         <span className="text-[#6366F1] font-medium cursor-pointer hover:text-[#4F46E5] transition-colors">
//                                             Sign up for free
//                                         </span>
//                                     </NavLink>
//                                 </p>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default Login;

import Checkbox from '@mui/material/Checkbox';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GoogleIcon from "../../assets/icons/googleicon.png";
import AppleIcon from "../../assets/icons/applelogo.png";
import LinkedInIcon from "../../assets/icons/LinkedIn.png";
import { useState } from 'react';
// import Button from '../../components/Button';
import Input from "../../components/Inputs";
// import Logo from "../../assets/Background.png"
import { useFormik } from "formik";
import { NavLink } from 'react-router-dom';

function Login() {
    const [isLoading, setIsLoading] = useState(false);

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
                console.log('Login submitted:', values);
                // TODO: call your API here
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div
            className="min-h-screen bg-cover bg-center text-white flex flex-col justify-between"
        >

            <nav className="sticky top-0 shadow-md">
                {/* Header */}
                <header className=" px-6 md:px-10 py-3 flex items-center gap-2">
                    <img src={Logo} alt='Logo' className='w-10 h-10' />
                    <span className="font-bold text-lg tracking-wide font-[Poppins] text-[#6366F1]">EduFlow</span>
                </header>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center px-2 py-2">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-items-center">

                    <div className="w-full max-w-[390px] bg-[#1E1E24]/90 backdrop-blur-md border border-white/10 rounded-[24px] p-6 md:p-6 h-96 shadow-2xl flex flex-col justify-start gap-6">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 border border-white/10">
                                <AutoAwesomeIcon sx={{ fontSize: 20, color: '#CBD5E1' }} />
                            </div>

                            <h1 className="text-white font-bold text-2xl md:text-3xl font-[Poppins] leading-tight tracking-tight mb-3">
                                Unleash your<br />visionary potential.
                            </h1>

                            <p className="text-[#94A3B8] font-[Manrope] text-xs md:text-sm leading-relaxed mb-2">
                                Experience a high-end educational journey where academic rigor meets
                                cutting-edge digital aesthetics. EduFlow bridges the gap between
                                learning and doing.
                            </p>
                        </div>


                        <div className="flex gap-4 ">
                            <div>
                                <span className="block text-white text-lg md:text-lg font-semibold font-[Poppins]">15k+</span>
                                <span className="text-[#64748B] text-[10px] md:text-xs font-[Poppins] mt-0.5 block">Active Learners</span>
                            </div>
                            <div>
                                <span className="block text-white text-lg md:text-lg font-semibold font-[Poppins]">98%</span>
                                <span className="text-[#64748B] text-[10px] md:text-xs font-[Poppins] mt-0.5 block">Success Rate</span>
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
                                    onClick={() => navigate("/home")}
                                    variant="primary"
                                    disabled={isLoading}
                                    className="w-full h-10 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] !py-2 text-xs"
                                >
                                    {isLoading ? "Signing In..." : "Sign In"}
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