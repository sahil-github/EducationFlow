import React, { useState } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { useFormik } from 'formik';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Button from '../../components/Button';
import Input from '../../components/Inputs';
import Logo from '../../assets/logo/Logo.png';
import Margin from '../../assets/Margin.png';
import GoogleIcon from '../../assets/icons/googleicon.png';
import AppleIcon from '../../assets/icons/applelogo.png';
import LinkedInIcon from '../../assets/icons/LinkedIn.png';
import { Users } from "lucide-react";

function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmpassword: '',
            agree: false
        },
        validate: (values) => {
            const errors = {};
            if (!values.name) {
                errors.name = 'Name is required';
            }
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

            if (!values.confirmpassword) {
                errors.confirmpassword = "Confirm Password is required"
            } else if (values.confirmpassword !== values.password) {
                errors.confirmpassword = 'Password does not match';
            }

            // if (!values.agree) {
            //     errors.agree = 'You must agree to the Terms and Privacy Policy';
            // }

            return errors;
        },
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const Users = JSON.parse(localStorage.getItem('users')) || [];

                const userExists = Users.some(u => u.email === values.email);
                if (userExists) {
                    alert("User already exists! Please log in.");
                    navigate("/login");
                    return;
                }
                const newUser = { ...values };
                Users.push(newUser);
                localStorage.setItem("users", JSON.stringify(Users));

                localStorage.setItem("current_user", JSON.stringify(newUser));
                alert("Registration Successful! Fill all details");
                navigate("/personal-info");

            } finally {
                setIsLoading(false);
            }
        },
    });



    return (
        <div
            // style={{ backgroundImage: `url(${backgroundImage})` }}
            className="min-h-screen bg-cover bg-center text-white flex flex-col justify-between"
        >
            <nav className="sticky top-0 shadow-md  z-50 bg-[#18181C]">
                {/* Header */}
                <header className="px-8 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-2">
                        <NavLink to="/" className="flex items-center gap-2" >
                            <img src={Logo} alt='Logo' className='w-10 h-10' />
                            <span className="font-bold text-xl tracking-wide font-[Poppins] text-[#6366F1]">EduFlow</span>
                        </NavLink>
                    </div>

                    <span className="text-[#A1A1AA] text-xs font-[Manrope]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#6366F1] font-semibold hover:text-[#4F46E5] transition-colors ml-1">
                            Sign In
                        </Link>
                    </span>
                </header>
            </nav>
            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Left Column - Hero Description */}
                    <div className="lg:col-span-7 flex flex-col gap-6 justify-start p-4 sm:p-6 ">
                        {/* Join the Cohort Pill */}
                        <div className="self-start px-3 py-1 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-full">
                            <span className="text-[#6366F1] text-[10px] uppercase font-bold tracking-wider font-[Manrope]">Join the Cohort</span>
                        </div>

                        <h1 className="text-white font-bold text-3xl sm:text-5xl font-[Poppins] leading-tight tracking-tight">
                            Accelerate your<br />
                            <span className="text-[#6366F1]">career trajectory.</span>
                        </h1>

                        <p className="text-[#94A3B8] font-[Manrope] text-sm sm:text-base leading-relaxed max-w-xl">
                            Join over 50,000+ lifelong learners mastering modern skills
                            through EduFlow's high-rigor, industry-aligned curriculum.
                        </p>

                        {/* Feature Blocks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">

                            <div className="bg-[#18181C]/60 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 shadow-md">
                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 self-start">
                                    <AutoAwesomeIcon sx={{ fontSize: 18, color: '#6366F1' }} />
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-semibold font-[Poppins] mb-1">Adaptive AI</h3>
                                    <p className="text-[#64748B] text-xs font-[Manrope] leading-relaxed">
                                        Personalized learning paths tailored to your goals.
                                    </p>
                                </div>
                            </div>


                            <div className="bg-[#18181C]/60 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 shadow-md">
                                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 self-start">
                                    <Users size={18} className="text-[#6366F1]" />
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-semibold font-[Poppins] mb-1">Global Network</h3>
                                    <p className="text-[#64748B] text-xs font-[Manrope] leading-relaxed">
                                        Connect with experts from world-class organizations.
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="mt-4">
                            <img src={Margin} alt="Illustration of business meeting" className="w-full h-auto rounded-2xl  " />
                        </div>
                    </div>

                    {/* Right Column (Sign Up Form) */}
                    <div className="lg:col-span-5 flex flex-col gap-5 items-center justify-center w-full">
                        <div className="w-full max-w-[390px] bg-[#18181C] border border-white/5 rounded-[24px] p-6 md:p-8 shadow-2xl">
                            <h2 className="text-white font-semibold text-xl md:text-2xl font-[Poppins] tracking-tight mb-1.5">
                                Create your account
                            </h2>
                            <p className="text-[#71717A] text-xs font-[Manrope] mb-6">
                                Get started for free today.
                            </p>

                            {/* Social Icons Row */}
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
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-[#52525B] text-[10px] font-[Manrope] tracking-widest uppercase">Or Email</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Form */}
                            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                                {/* Full Name */}
                                <Input
                                    size="small"
                                    label="Full Name"
                                    type="text"
                                    placeholder="Alex Carter"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && formik.errors.name}

                                />

                                {/* Email */}
                                <Input
                                    size="small"
                                    label="Email "
                                    type="email"
                                    placeholder="alex@example.com"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && formik.errors.email}

                                />

                                {/* Password */}
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && formik.errors.password}
                                    size="small"
                                />
                                <span className="text-[#64748B] text-[10px] font-[Manrope] -mt-3 self-start block">Min. 8 characters</span>
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="••••••••"
                                    name="confirmpassword"
                                    value={formik.values.confirmpassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmpassword && formik.errors.confirmpassword}
                                    size="small"
                                />



                                {/* Agreement Checkbox */}
                                {/* <div className="flex flex-col gap-1">
                                    <div className="flex items-start  gap-1.5 ">
                                        <Radio
                                            type="button"
                                            size="small"
                                            checked={formik.values.agree || clicked}
                                            onClick={() => setClicked(!clicked)}
                                            onChange={(e) => formik.setFieldValue('agree', e.target.checked)}
                                            sx={{
                                                color: 'rgba(255,255,255,0.2)',
                                                '&.Mui-checked': { color: '#6366F1' },
                                                padding: '1px',
                                            }}
                                        />
                                        <span className="text-[#A1A1AA] text-xs font-[Manrope] mt-0.5">
                                            I agree to the{' '}
                                            <span className="text-[#6366F1] cursor-pointer hover:underline">Terms</span>
                                            {' '}and{' '}
                                            <span className="text-[#6366F1] cursor-pointer hover:underline">Privacy Policy</span>.
                                        </span>

                                        {formik.touched.agree && formik.errors.agree && (
                                            <p className="text-[10px] text-red-500 font-[Manrope] ml-6">{formik.errors.agree}</p>
                                        )}
                                    </div>
                                </div> */}
                                {/* Create Account Button */}
                                <Button

                                    type='submit'
                                    variant="primary"
                                    disabled={isLoading}
                                    className="w-full h-11 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl tracking-wide uppercase transition-all duration-200 shadow-lg shadow-[#6366F1]/20 font-[Poppins] !py-2 text-xs"
                                >
                                    {isLoading ? "Creating..." : "Create Account"}
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Signup;