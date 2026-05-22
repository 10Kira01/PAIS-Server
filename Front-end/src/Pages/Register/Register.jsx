// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import AuthFormLogo from '../../Components/AuthFormLogo/AuthFormLogo';

// const registerSchema = z
//   .object({
//     role: z.enum(['client', 'pharmacy']),
//     password: z.string().min(8, 'Password must be at least 8 characters'),
//     confirmPassword: z.string(),
//     acceptedTerms: z
//       .boolean()
//       .refine((v) => v === true, { message: 'You must accept the terms and conditions' }),
//     firstName: z.string().optional(),
//     lastName: z.string().optional(),
//     email: z.union([z.literal(''), z.string().email('Invalid email')]).optional(),
//     phone: z.union([z.literal(''), z.string()]).optional(),
//     dateOfBirth: z.union([z.literal(''), z.string()]).optional(),
//     gender: z.any().optional(),
//     pharmacyName: z.string().optional(),
//     ownerName: z.string().optional(),
//     location: z.string().optional(),
//     licenseId: z.string().optional(),
//     pharmacyEmail: z.union([z.literal(''), z.string().email('Invalid email')]).optional(),
//     pharmacyPhone: z.union([z.literal(''), z.string()]).optional(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'Passwords do not match',
//     path: ['confirmPassword'],
//   });

// export default function Register() {
//   const navigate = useNavigate();
//   const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
//     resolver: zodResolver(registerSchema),
//     defaultValues: { role: 'client', gender: 'true', acceptedTerms: false },
//   });

//   const selectedRole = watch('role');

//   function firstValidationMessage(formErrors) {
//     const keys = [
//       'firstName',
//       'lastName',
//       'email',
//       'phone',
//       'dateOfBirth',
//       'pharmacyName',
//       'ownerName',
//       'location',
//       'licenseId',
//       'pharmacyEmail',
//       'pharmacyPhone',
//       'password',
//       'confirmPassword',
//       'acceptedTerms',
//       'role',
//     ];
//     for (const k of keys) {
//       const e = formErrors[k];
//       if (e?.message) return String(e.message);
//     }
//     for (const k of Object.keys(formErrors)) {
//       const e = formErrors[k];
//       if (e?.message) return String(e.message);
//     }
//     return 'Please check the form and try again.';
//   }

//   const onInvalid = (formErrors) => {
//     toast.error(firstValidationMessage(formErrors));
//   };

//   const onSubmit = async (data) => {
//     try {
//       let endpoint = '';
//       let payload = {};

//       if (data.role === 'client') {
//         endpoint = 'https://pais-production.up.railway.app/api/client/register';
//         payload = {
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email,
//           phone: data.phone,
//           dateOfBirth: data.dateOfBirth,
//           gender: data.gender === "true",
//           password: data.password,
//           confirmPassword: data.confirmPassword,
//           acceptedTerms: data.acceptedTerms
//         };
//       } else {
//         endpoint = 'https://pais-production.up.railway.app/api/pharmacy/register';
//         payload = {
//           pharmacyName: data.pharmacyName,
//           ownerName: data.ownerName,
//           address: data.location,
//           licenseId: data.licenseId,
//           pharmacyEmail: data.pharmacyEmail,
//           pharmacyPhone: data.pharmacyPhone,
//           password: data.password,
//           confirmPassword: data.confirmPassword,
//           acceptedTerms: data.acceptedTerms,
//         };
//       }

//       const response = await axios.post(endpoint, payload);

//       if (response.data.success) {
//         toast.success("Registration Successful!");
//         navigate('/login');
//       }
//     } catch (error) {
//       console.log('Full error:', error.response?.data);
//       const apiErrors = error.response?.data?.errors;
//       const firstError =
//         Array.isArray(apiErrors) && apiErrors.length > 0
//           ? apiErrors[0].message
//           : error.response?.data?.message || 'Registration failed';
//       toast.error(firstError);
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen py-10 px-4 flex justify-center items-center">
//       <div className="bg-white w-full max-w-4xl p-8 rounded-3xl shadow-lg border border-gray-100">
//         <AuthFormLogo className="sm:mb-8" />
//         <h2 className="text-3xl font-bold text-cyan-900 text-center mb-2">Create Account</h2>
//         <p className="text-center text-gray-500 mb-8">Join the PAIS Pharmaceutical Network</p>

       
//         <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 w-64 mx-auto">
//           <label className={`flex-1 text-center py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${
//             selectedRole === 'client' ? 'bg-cyan-900 text-white shadow' : 'text-gray-500'
//           }`}>
//             <input type="radio" {...register('role')} value="client" className="hidden" />
//             Client
//           </label>
//           <label className={`flex-1 text-center py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${
//             selectedRole === 'pharmacy' ? 'bg-cyan-900 text-white shadow' : 'text-gray-500'
//           }`}>
//             <input type="radio" {...register('role')} value="pharmacy" className="hidden" />
//             Pharmacy
//           </label>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

           
//             {selectedRole === 'client' && (
//               <>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">First Name</label>
//                   <input {...register('firstName')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="Ahmed" />
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">Last Name</label>
//                   <input {...register('lastName')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="Hassan" />
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">Email</label>
//                   <input type="email" {...register('email')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="ahmed@mail.com" />
//                   {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">
//                     Phone <span className="text-gray-400 font-normal">(e.g. +201012345678)</span>
//                   </label>
//                   <input {...register('phone')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="+201012345678" />
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
//                   <input type="date" {...register('dateOfBirth')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" />
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">Gender</label>
//                   <select {...register('gender')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600">
//                     <option value="true">Male</option>
//                     <option value="false">Female</option>
//                   </select>
//                 </div>
//               </>
//             )}

            
//             {selectedRole === 'pharmacy' && (
//               <>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">Pharmacy Name</label>
//                   <input {...register('pharmacyName')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="Al-Shifa Pharmacy" />
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">Owner Name</label>
//                   <input {...register('ownerName')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="Mohamed Ali" />
//                 </div>
//                 <div className="flex flex-col md:col-span-2">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">Location Address</label>
//                   <input {...register('location')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="12 Tahrir Square, Cairo, Egypt" />
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">License ID</label>
//                   <input {...register('licenseId')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="LIC-2024-XXXX" />
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">Pharmacy Email</label>
//                   <input type="email" {...register('pharmacyEmail')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="info@pharmacy.com" />
//                   {errors.pharmacyEmail && (
//                     <span className="text-red-500 text-xs mt-1">{errors.pharmacyEmail.message}</span>
//                   )}
//                 </div>
//                 <div className="flex flex-col">
//                   <label className="text-sm font-semibold text-gray-600 mb-1">
//                     Pharmacy Phone <span className="text-gray-400 font-normal">(e.g. +20223456789)</span>
//                   </label>
//                   <input {...register('pharmacyPhone')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="+20223456789" />
//                 </div>
//               </>
//             )}

           
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-600 mb-1">Password</label>
//               <input type="password" {...register('password')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" />
//               {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
//             </div>
//             <div className="flex flex-col">
//               <label className="text-sm font-semibold text-gray-600 mb-1">Confirm Password</label>
//               <input type="password" {...register('confirmPassword')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" />
//               {errors.confirmPassword && <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>}
//             </div>
//           </div>

         
//           <div className="flex items-center gap-2">
//             <input type="checkbox" {...register('acceptedTerms')} className="w-4 h-4 accent-cyan-900" />
//             <label className="text-sm text-gray-600">I agree to the terms and conditions</label>
//           </div>
//           {errors.acceptedTerms && <p className="text-red-500 text-xs">{errors.acceptedTerms.message}</p>}

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-cyan-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-cyan-950 transition-all shadow-lg disabled:bg-gray-300"
//           >
//             {isSubmitting ? 'Processing...' : 'Register'}
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-500">
//           Already have an account? <Link to="/login" className="text-cyan-700 font-bold">Sign in</Link>
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthFormLogo from '../../Components/AuthFormLogo/AuthFormLogo';
const API_URL = import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || 'https://pais-production.up.railway.app';

const GEOAPIFY_API_KEY = import.meta.env?.VITE_GEOAPIFY_API_KEY || process.env.REACT_APP_GEOAPIFY_API_KEY;

const registerSchema = z.object({
  role: z.enum(['client', 'pharmacy']),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: "You must accept terms" }) }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.any().optional(),
  pharmacyName: z.string().optional(),
  ownerName: z.string().optional(),
  location: z.string().optional(),
  licenseId: z.string().optional(),
  pharmacyEmail: z.string().email("Invalid email").optional(),
  pharmacyPhone: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const navigate = useNavigate();

  // ── Autocomplete state ──────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,                      // ← needed to set lat/lng/location
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'client', gender: "true" }
  });

  const selectedRole = watch('role');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce (300ms)
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setValue('location', value); // keep RHF in sync while typing

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://api.geoapify.com/v1/geocode/autocomplete`,
          {
            params: {
              text: value,
              apiKey: GEOAPIFY_API_KEY,
              limit: 5,
              format: 'json',
            },
          }
        );
        const results = res.data.results || [];
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  // Fill all three fields when user picks a suggestion
  const handleSelectSuggestion = (place) => {
    const address = place.formatted;
    const lat = place.lat?.toString() ?? '';
    const lon = place.lon?.toString() ?? '';

    setLocationInput(address);
    setValue('location', address);
    setValue('lat', lat);
    setValue('lng', lon);

    setSuggestions([]);
    setShowDropdown(false);
  };

 
  const onSubmit = async (data) => {
    try {
      let endpoint = '';
      let payload = {};

      if (data.role === 'client') {
        endpoint = `${API_URL}/api/client/register`;
        payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender === "true",
          password: data.password,
          confirmPassword: data.confirmPassword,
          acceptedTerms: data.acceptedTerms,
        };
      } else {
        endpoint = `${API_URL}/api/pharmacy/register`;
        payload = {
          pharmacyName: data.pharmacyName,
          ownerName: data.ownerName,
          location: data.location,
          address: data.location,
          licenseId: data.licenseId,
          pharmacyEmail: data.pharmacyEmail,
          pharmacyPhone: data.pharmacyPhone,
          password: data.password,
          confirmPassword: data.confirmPassword,
          acceptedTerms: data.acceptedTerms,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
        };
      }

      const response = await axios.post(endpoint, payload);
      if (response.data.success) {
        toast.success("Registration Successful!");
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl p-8 rounded-3xl shadow-lg border border-gray-100">
        <AuthFormLogo className="sm:mb-8" />
        <h2 className="text-3xl font-bold text-cyan-900 text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join the PAIS Pharmaceutical Network</p>

      
        <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 w-64 mx-auto">
          <label className={`flex-1 text-center py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${selectedRole === 'client' ? 'bg-cyan-900 text-white shadow' : 'text-gray-500'}`}>
            <input type="radio" {...register('role')} value="client" className="hidden" />
            Client
          </label>
          <label className={`flex-1 text-center py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${selectedRole === 'pharmacy' ? 'bg-cyan-900 text-white shadow' : 'text-gray-500'}`}>
            <input type="radio" {...register('role')} value="pharmacy" className="hidden" />
            Pharmacy
          </label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            
            {selectedRole === 'client' && (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">First Name</label>
                  <input {...register('firstName')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="Ahmed" />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Last Name</label>
                  <input {...register('lastName')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="Hassan" />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Personal Email</label>
                  <input type="email" {...register('email')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="ahmed@mail.com" />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Phone</label>
                  <input {...register('phone')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="+201..." />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
                  <input type="date" {...register('dateOfBirth')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Gender</label>
                  <select {...register('gender')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600">
                    <option value="true">Male</option>
                    <option value="false">Female</option>
                  </select>
                </div>
              </>
            )}

           
            {selectedRole === 'pharmacy' && (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Pharmacy Name</label>
                  <input {...register('pharmacyName')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="Al-Shifa Pharmacy" />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Owner Name</label>
                  <input {...register('ownerName')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="Mohamed Ali" />
                </div>

                {/* ── Location Autocomplete ── */}
                <div className="flex flex-col md:col-span-2 relative" ref={dropdownRef}>
                  <label className="text-sm font-semibold text-gray-600 mb-1">Location Address</label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={handleLocationChange}
                    onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                    className="p-3 bg-gray-50 border rounded-xl outline-cyan-600"
                    placeholder="Start typing an address..."
                    autoComplete="off"
                  />
                  {showDropdown && (
                    <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                      {suggestions.map((place, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectSuggestion(place)}
                          className="px-4 py-3 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-900 cursor-pointer border-b last:border-b-0 transition-colors"
                        >
                          📍 {place.formatted}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">License ID</label>
                  <input {...register('licenseId')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="LIC-2024-XXXX" />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Pharmacy Email</label>
                  <input type="email" {...register('pharmacyEmail')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="info@pharmacy.com" />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">Pharmacy Phone</label>
                  <input {...register('pharmacyPhone')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" placeholder="+202..." />
                </div>

                {/* Lat / Lng — auto-filled, but editable */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600">Latitude</label>
                    <input
                      {...register('lat')}
                      className="p-3 bg-gray-50 border rounded-xl outline-cyan-600 text-sm text-gray-500"
                      placeholder="Auto-filled"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600">Longitude</label>
                    <input
                      {...register('lng')}
                      className="p-3 bg-gray-50 border rounded-xl outline-cyan-600 text-sm text-gray-500"
                      placeholder="Auto-filled"
                      readOnly
                    />
                  </div>
                </div>
              </>
            )}

           
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Password</label>
              <input type="password" {...register('password')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" />
              {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Confirm Password</label>
              <input type="password" {...register('confirmPassword')} className="p-3 bg-gray-50 border rounded-xl outline-cyan-600" />
              {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register('acceptedTerms')} className="w-4 h-4 accent-cyan-900" />
            <label className="text-sm text-gray-600">I agree to the terms and conditions</label>
          </div>
          {errors.acceptedTerms && <p className="text-red-500 text-xs">{errors.acceptedTerms.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-cyan-950 transition-all shadow-lg disabled:bg-gray-300"
          >
            {isSubmitting ? 'Processing...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Already have an account? <Link to="/login" className="text-cyan-700 font-bold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}