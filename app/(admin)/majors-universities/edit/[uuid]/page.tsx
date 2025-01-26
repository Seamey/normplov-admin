"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import {
  useEditUniversityMutation,
  useUniversityDetailsQuery,
} from "@/app/redux/service/university";
import { ImageUploadArea } from "@/app/Components/image/image-upload-area";
import { UniversityType, UploadImageResponse } from "@/types/types";
import { useUploadImageMutation } from "@/app/redux/service/media";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Image from "next/image";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const SchoolSchema = Yup.object().shape({
  kh_name: Yup.string(),
  en_name: Yup.string(),
  phone: Yup.string(),
  email: Yup.string().email("Invalid email"),
  website: Yup.string().url("Invalid URL"),
  popular_major: Yup.string(),
  lowest_price: Yup.number().positive("Must be positive"),
  highest_price: Yup.number().positive("Must be positive"),
  location: Yup.string(),
  map_url: Yup.string(),
  vision: Yup.string(),
  mission: Yup.string(),
  description: Yup.string(),
  cover_image: Yup.mixed().nullable(),
  logo_url: Yup.mixed(),
  school_type: Yup.string(),
});

export default function EditUniversityPage({
  params,
}: {
  params: { uuid: string };
}) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useUniversityDetailsQuery(params.uuid);
  const [editUniversity, { isLoading: isUpdating }] =
    useEditUniversityMutation();
  const [, setSubmissionError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [uploadImage] = useUploadImageMutation()

  const university = data?.payload
  console.log("university in edit:", university)

  if (isError) {
    toast.error("Failed to load university data. Please try again.", {
      hideProgressBar: true
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span className="text-xl font-semibold">
          Loading university data...
        </span>
      </div>
    );
  }
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    setFieldValue: (field: string, value: any) => void,
    fieldName: string
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFieldValue(fieldName, file); // Update Formik field
    }
  };

  const initialValues = {
    kh_name: university.kh_name || "",
    en_name: university.en_name || "",
    phone: university.phone || "",
    email: university.email || "",
    website: university.website || "",
    popular_major: university.popular_major || "",
    lowest_price: university.lowest_price || 0,
    highest_price: university.highest_price || 0,
    map_url: university.map_url || "",
    vision: university.vision || "",
    mission: university.mission || "",
    description: university.description || "",
    school_type: university.type || "",
    cover_image: university.cover_image || null || File,
    logo_url: university.logo_url || null || File,
    location: university.location || "",
    is_popular: false
  }

  const handleUploadImage = async (file: File) => {
    try {
      const res: UploadImageResponse = await uploadImage({ url: file }).unwrap();
      toast.success("Upload Logo successfully!", {
        hideProgressBar: true
      })
      return res.payload.file_url;
    } catch (error) {
      console.log("Error upload image:", error)
      toast.error("Failed to upload the image. Please try again.", {
        hideProgressBar: true
      });
      return null;
    }
  };

  // const initialValues = {}
  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-secondary">Edit University</h1>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={SchoolSchema}
        // onSubmit={console.log}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmissionError(null);

          try {
            let logoUrl: string | null = typeof values.logo_url === "string" ? values.logo_url : university.logo_url; // Default to the existing logo URL
            let coverImageUrl: string | null = typeof values.cover_image === "string" ? values.cover_image : university.cover_image; // Default to the existing cover image URL

            // Upload the logo if it's a new file
            if (values.logo_url instanceof File) {
              const uploadedLogoUrl = await handleUploadImage(values.logo_url);
              if (uploadedLogoUrl) {
                logoUrl = uploadedLogoUrl;
                console.log("Logo uploaded successfully:", logoUrl);
              } else {
                throw new Error("Failed to upload the logo image");
              }
            }


            // Upload the cover image if it's a new file
            if (values.cover_image instanceof File) {
              const uploadedCoverImageUrl = await handleUploadImage(values.cover_image);
              if (uploadedCoverImageUrl) {
                coverImageUrl = uploadedCoverImageUrl;
                console.log("Cover image uploaded successfully: ", coverImageUrl);
              } else {
                throw new Error("Failed to upload the cover image");
              }
            }

            // Prepare the data for updating the university
            const updatedUniversity: UniversityType = {
              ...values,
              logo_url: logoUrl, // Use the uploaded or existing logo URL
              cover_image: coverImageUrl, // Use the uploaded or existing cover image URL
              school_type: values.school_type || university?.type || "",
            };

            // Call the mutation to update the university
            await editUniversity({ uuid: params.uuid, data: updatedUniversity }).unwrap();

            toast.success("University updated successfully!", {
              hideProgressBar: true
            });
            router.push("/majors-universities");
          } catch (err) {
            console.error("Failed to update university:", err);
            setSubmissionError("Failed to update university. Please try again.");
            toast.error("Failed to update university. Please try again.", {
              hideProgressBar: true
            });
          } finally {
            setSubmitting(false);
          }
        }}


      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="space-y-4">
              <div>
                <Label htmlFor="cover_image" className="block text-md font-normal py-2 text-primary">Cover Image</Label>

                <div className="space-y-6 mb-6">
                  <div
                    className="relative border-dashed border-2 bg-gray-100 w-full h-64 rounded-lg overflow-hidden flex items-center justify-center"
                    onDrop={(e) => handleDrop(e, setFieldValue, "cover_image")}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {values.cover_image ? (
                      <Image
                        src={
                         "/assets/placeholder.png"
                        }
                        alt="Cover Image"
                        className="object-cover w-full h-full"
                        width={400}
                        height={300}
                      />
                    ) : (
                      <Button className="text-white bg-primary border boder-md">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload</Button>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setFieldValue("cover_image", e.target.files?.[0])}
                    />
                  </div>
                  <ErrorMessage name="cover_image" component="div" className="text-red-500 text-sm" />
        
                </div>
                <div className="flex space-x-4">
                  <div>
                    <Label htmlFor="logo_Url" className="block text-md font-normal py-2 text-primary">Logo</Label>
                    {/* <Field name="logo" > */}
                    <div
                      className="relative border-dashed border-2 bg-gray-100 w-96 h-64 rounded-lg overflow-hidden flex items-center justify-center"
                      onDrop={(e) => handleDrop(e, setFieldValue, "logo")}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {/* {values.logo_url ? ( */}
                        <Image
                        src={
                          university?.logo_url
                            ? `${process.env.NEXT_PUBLIC_NORMPLOV_API}${university.logo_url}`
                            : "/assets/placeholder.png"
                        }
                        alt="University Logo"
                        width={1000}
                        height={1000}
                        className="object-cover"
                      />
                      
                      
                      {/* ) : ( */}
                        <Button className="text-white bg-primary border boder-md">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload</Button>
                      {/* )} */}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setFieldValue("logo", e.target.files?.[0])}
                      />
                    </div>
                    <ErrorMessage name="logo" component="div" className="text-red-500 text-sm" />

                    {/* </Field> */}
                  </div>
                  <div className="flex flex-col space-y-4 w-full">
                    <div className="flex gap-4 w-full">
                      <div className="w-full">
                        <Label className="block text-md font-normal py-2 text-primary" htmlFor="kh_name">Khmer Name</Label>
                        <Field
                          as={Input}
                          id="kh_name"
                          name="kh_name"
                          placeholder={university.kh_name || "Enter Khmer Name"}
                          type="text"
                        />
                        <ErrorMessage
                          name="kh_name"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="w-full">
                        <Label className="block text-md font-normal py-2 text-primary" htmlFor="en_name">English Name</Label>
                        <Field
                          as={Input}
                          id="en_name"
                          name="en_name"
                          placeholder={university.en_name || "Enter English Name"}
                          type="text"
                        />
                        <ErrorMessage
                          name="en_name"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 w-full">
                      <div className="w-full">
                        <Label htmlFor="phone" className="block text-md font-normal py-2 text-primary">Phone</Label>
                        <Field as={Input} id="phone" name="phone" type="text" placeholder={university.phone || "Enter phone number"} />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="w-full">
                        <Label htmlFor="email" className="block text-md font-normal py-2 text-primary">Email</Label>
                        <Field as={Input} id="email" name="email" type="email" placeholder={university.email || "Enter your email"} />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-full">
                        <Label htmlFor="website" className="block text-md font-normal py-2 text-primary">Website</Label>
                        <Field
                          as={Input}
                          id="website"
                          name="website"
                          placeholder={university.website || "Enter website URL here..."}
                          type="url"
                        />
                        <ErrorMessage
                          name="website"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="w-full">
                        <Label htmlFor="type" className="block text-md font-normal py-2 text-primary">School Type</Label>

                        <Field name="type">
                          {({ field, form }: FieldProps) => (
                            <Select
                              // value from Formik
                              value={field.value}
                              // update Formik state on change
                              onValueChange={(val) => {
                                if (val !== field.value) {
                                  form.setFieldValue(field.name, val);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={field.value || "Select School Type"} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PUBLIC">Public School</SelectItem>
                                <SelectItem value="PRIVATE">Private School</SelectItem>
                                <SelectItem value="TVET">TVET</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </Field>
                        <ErrorMessage
                          name="type"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 w-full">
                      <div className="w-full">
                        <Label htmlFor="popular_major" className="block text-md font-normal py-2 text-primary">Popular Major</Label>
                        <Field
                          as={Input}
                          id="popular_major"
                          name="popular_major"
                          placeholder={university.popular_major || "Enter Popular Major"}
                          type="text"
                        />
                        <ErrorMessage
                          name="popular_major"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex gap-4 w-full">
                        <div className="w-full">
                          <Label htmlFor="lowest_price" className="block text-md font-normal py-2 text-primary">Lowest Price</Label>
                          <Field
                            as={Input}
                            id="lowest_price"
                            name="lowest_price"
                            placeholder={university.lowest_price || "Enter lowest price"}
                            type="number"
                          />
                          <ErrorMessage
                            name="lowest_price"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="w-full">
                          <Label htmlFor="highest_price" className="block text-md font-normal py-2 text-primary">Highest Price</Label>
                          <Field
                            as={Input}
                            id="highest_price"
                            name="highest_price"
                            type="number"
                            placeholder={university.highest_price || "Enter highest price"}
                          />
                          <ErrorMessage
                            name="highest_price"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>

                </div>

              </div>
              <div className="flex gap-4 w-full justify-between items-center ">
                <div className="w-9/12">
                  <Label htmlFor="location">Location</Label>
                  <div className="w-full">
                    <Field name="location"
                      placeholder="Enter location"
                      className="border border-gray-300 py-2 rounded-md px-3 w-full"
                    >
                    </Field>
                  </div>
                  <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Field
                    type="checkbox"
                    id="is_popular"
                    name="is_popular"
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm">
                    <Field name="is_popular">
                      {({ field }: { field: { value: boolean } }) =>
                        field.value ? "Popular School" : "School Not Popular"
                      }
                    </Field>
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="map_url" className="block text-md font-normal py-2 text-primary">Google Maps Link</Label>
                <Field as={Input} id="map_url" name="map_url" placeholder={university.map_url || "Enter Google Maps Link"} />
                <ErrorMessage
                  name="map_url"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mission" className="block text-md font-normal py-2 text-primary">Mission</Label>
                  {/* <ReactQuill
                  id="mission"
                  value={university.mission || ""}
                  onChange={(value) => setFieldValue("mission", value)} // Formik's setFieldValue
                  placeholder="Enter your mission here"
                  className="mb-2"
                /> */}
                  <Field as={Textarea} id="mission" name="mission" placeholder={university.mission || "Enter your mission here"} />
                  <ErrorMessage
                    name="mission"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="vision" className="block text-md font-normal py-2 text-primary">Vision</Label>
                  <Field as={Textarea} id="vision" name="vision" placeholder={university.vision || "Enter your vision here"} />
                  <ErrorMessage
                    name="vision"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="block text-md font-normal py-2 text-primary">Description</Label>
                <Field as={Textarea} id="description" name="description" placeholder={university.description || "Enter Description"} />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isUpdating}
                  className="bg-primary"
                  aria-busy={isSubmitting || isUpdating}
                >
                  {isSubmitting || isUpdating
                    ? "Updating..."
                    : "Update University"}
                </Button>
              </div>
            </div>
              {/* {submissionError && (
              <div className="text-red-500 mt-4">{submissionError}</div>
            )}*/}
              <div className="mt-8 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-semibold mb-2">
                  Form Values (Debug):
                </h3>
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </div>
          </Form>
        )}
      </Formik>
    </div >
  );
}