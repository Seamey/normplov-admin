"use client";

import React from "react";
import { HiCamera } from "react-icons/hi2";
import { IoMdCalendar } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/app/redux/service/user";
import { Skeleton } from "@/components/ui/skeleton";



const ProfileSetting = () => {
    const router = useRouter();
    const { data: user, isLoading, error } = useGetMeQuery();
    const userData = user?.payload;

    const handleUpdateProfile = () => {
        router.push("/updateProfile");
    };

    if (isLoading) {
        return (
            <div className="p-4 space-y-4 mx-8">
                {/* Profile Header */}
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" /> {/* Profile Setting Title */}
                    <Skeleton className="h-32 w-full rounded-lg" /> {/* Background Banner */}
                </div>

                {/* Profile Picture and Details */}
                <div className="flex flex-col space-y-4 justify-start ">
                    <Skeleton className="h-24 w-24 rounded-full mx-10" />
                    <Skeleton className="h-4 w-32 mx-5" />
                    <Skeleton className="h-4 w-48 " />
                </div>
                {/* Edit Button */}
                <div className="flex justify-end">
                    <Skeleton className="h-8 w-24 rounded-md" />
                </div>
                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>


            </div>
        );
    }

    if (error) {
        console.error("Error fetching user:", error);
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-red-500 text-lg">Error loading profile. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto">
            <div className="mx-10">
                <h1 className="text-3xl font-semibold my-5 text-secondary">Profile Setting</h1>
                <div className="relative w-full h-40 bg-primary rounded-lg mb-20">
                    <div className="absolute -bottom-32 left-20">
                        <div className="relative border border-1 bg-[#fdfdfd] w-40 h-40 rounded-full ">
                            <img
                                src={`${process.env.NEXT_PUBLIC_NORMPLOV_API}${userData?.avatar}` || "/assets/placeholderProfile.png"}
                                alt="Profile picture"
                                width={1000}
                                height={1000}
                                className="w-40 h-40 rounded-full border-4 border-white object-cover"
                            />
                            <button
                                onClick={handleUpdateProfile}
                                className="text-textprimary absolute bottom-4 left-32 bg-white p-1 rounded-full border"
                            >
                                <HiCamera />
                            </button>
                        </div>

                        <div className="mt-2 text-center">
                            <h2 className="font-semibold text-lg text-textprimary">
                                {userData?.username || "N/A"}
                            </h2>
                            <p className="text-sm text-gray-700">
                                {userData?.email || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6">
                    <div className="flex justify-end">
                        <Button onClick={handleUpdateProfile} className="bg-primary hover:bg-emerald-600 px-6">
                            Edit
                        </Button>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-8 ">
                            <div className="flex flex-col space-y-3">
                                <label htmlFor="username" className="text-sm font-normal text-gray-500">
                                    Username
                                </label>
                                <div className="border p-2 bg-[#f9f9f9] rounded-md text-textprimary text-md">
                                    {userData?.username || "N/A"}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <label htmlFor="email" className="text-sm font-normal text-gray-500">
                                    Email
                                </label>
                                <div className="border p-2 bg-[#f9f9f9] rounded-md text-textprimary text-md">
                                    {userData?.email || "N/A"}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col space-y-3">
                                <label htmlFor="gender" className="text-sm font-normal text-gray-500">
                                    Gender
                                </label>
                                <div className="border p-2 bg-[#f9f9f9] rounded-md text-textprimary text-md">
                                    {userData?.gender || "N/A"}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <label htmlFor="dob" className="text-sm font-normal text-gray-500">
                                    Date of Birth
                                </label>
                                <div className="flex items-center border p-2 bg-[#f9f9f9] rounded-md text-textprimary text-md">
                                    <div className="bg-transparent w-full border-none outline-none text-textprimary">
                                        {userData?.date_of_birth || "N/A"}
                                    </div>
                                    <IoMdCalendar className="text-gray-400 text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 ">
                            <div className="flex flex-col space-y-3">
                                <label htmlFor="address" className="text-sm font-normal text-gray-500">
                                    Address
                                </label>
                                <div className="border p-2 bg-[#f9f9f9] rounded-md text-textprimary text-md">
                                    {userData?.address || "N/A"}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <label htmlFor="phone_number" className="text-sm font-normal text-gray-500">
                                    Phone Number
                                </label>
                                <div className="border p-2 bg-[#f9f9f9] rounded-md text-textprimary text-md">
                                    {userData?.phone_number || "N/A"}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <label htmlFor="bio" className="text-sm font-normal text-gray-500">
                                Bio
                            </label>
                            <div className="border p-2 bg-[#f9f9f9] rounded-md text-textprimary text-md">
                                {userData?.bio || "N/A"}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetting;
