"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  email: "",
  address: "",
  language: "",
  nationality: "",
  emergencyContact: {
    name: "",
    relationship: "",
    emergencyPhone: "",
  },
  religion: "",
};

export default function Home() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io({
      path: "/socket.io",
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const patientIdRef = useRef(crypto.randomUUID());
  const emitActivity = () => {
    socketRef.current?.emit("patient-status", {
      patientId: patientIdRef.current,
      status: "🟡 Typing...",
    });

    clearTimeout(window.typingTimer);

    window.typingTimer = setTimeout(() => {
      socketRef.current?.emit("patient-status", {
        patientId: patientIdRef.current,
        status: "⚪ Idle",
      });
    }, 10000);
  };

  const emitUpdate = (newForm) =>
    socketRef.current.emit("patient-update", newForm);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const keys = name.split(".");

    setForm((prev) => {
      const newForm = { ...prev };

      let current = newForm;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...(current[key] ?? {}) };
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;

      emitUpdate(newForm);
      return newForm;
    });
  };

  const handleValueChange = (name, value) => {
    const updated = {
      ...form,
      [name]: value,
    };
    setForm(updated);
    emitUpdate(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.firstName.trim()) {
      newErrors.firstName = true;
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = true;
    }
    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = true;
    }
    if (!form.gender) {
      newErrors.gender = true;
    }
    if (!/^0\d{9}$/.test(form.phoneNumber.trim())) {
      newErrors.phoneNumber = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = true;
    }
    if (!form.address.trim()) {
      newErrors.address = true;
    }
    if (!form.language) {
      newErrors.language = true;
    }
    if (!form.nationality.trim()) {
      newErrors.nationality = true;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setUsers([...users, form]);

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      console.log("request failed");
      return;
    }
    const data = await response.json();
    console.log(data);

    socketRef.current?.emit("patient-status", {
      patientId: patientIdRef.current,
      status: "🟢 Submitted",
    });

    // Reset form
    setForm(initialForm);
    toast.success("Thank you! Your submission has been received.", {
      position: "top-center",
    });
  };

  const genderChoices = ["Male", "Female"];
  const languageChoices = ["Thai", "English", "Chinese"];
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-[2rem] lg:mx-auto my-[3rem] w-auto lg:w-full max-w-[50rem] p-[2rem] border rounded-xl"
      >
        <h1 className="mb-[1rem] text-[1.5rem] font-bold">
          Patient Information Form
        </h1>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Personal Information</FieldLegend>
            <FieldGroup className="m-5 w-auto">
              {/* firstName */}
              <Field data-invalid={errors.firstName}>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  onChange={(e) => {
                    handleChange(e);
                    emitActivity();
                  }}
                  value={form.firstName}
                  aria-invalid={errors.firstName}
                />
                {errors.firstName && (
                  <FieldDescription>This field is required</FieldDescription>
                )}
              </Field>
              {/* middleName - option */}
              <Field>
                <FieldLabel htmlFor="middleName">
                  Middle Name (Optional)
                </FieldLabel>
                <Input
                  name="middleName"
                  type="text"
                  placeholder="Middle Name"
                  onChange={(e) => {
                    handleChange(e);
                    emitActivity();
                  }}
                  value={form.middleName}
                />
              </Field>
              {/* lastName */}
              <Field data-invalid={errors.lastName}>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  onChange={(e) => {
                    handleChange(e);
                    emitActivity();
                  }}
                  value={form.lastName}
                  aria-invalid={errors.lastName}
                />
                {errors.lastName && (
                  <FieldDescription>This field is required</FieldDescription>
                )}
              </Field>
              <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                {/* dateOfBirth */}
                <Field data-invalid={errors.dateOfBirth} className="flex-1">
                  <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="justify-start font-normal"
                        aria-invalid={errors.dateOfBirth}
                      >
                        {form.dateOfBirth
                          ? form.dateOfBirth.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={form.dateOfBirth}
                        defaultMonth={form.dateOfBirth}
                        captionLayout="dropdown"
                        disabled={(date) => date > new Date()}
                        onSelect={(date) => {
                          const updated = {
                            ...form,
                            dateOfBirth: date,
                          };
                          setForm(updated);
                          emitUpdate(updated);
                          emitActivity();
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dateOfBirth && (
                    <FieldDescription>This field is required</FieldDescription>
                  )}
                </Field>
                {/* gender */}
                <FieldSet className="flex-1">
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  {errors.gender && (
                    <FieldDescription>This field is required</FieldDescription>
                  )}
                  <RadioGroup
                    value={form.gender}
                    onValueChange={(value) => {
                      handleValueChange("gender", value);
                      emitActivity();
                    }}
                    className="w-fit flex gap-5"
                  >
                    {genderChoices.map((choice, index) => (
                      <Field
                        key={index}
                        orientation="horizontal"
                        data-invalid={errors.gender}
                      >
                        <RadioGroupItem
                          value={choice.toLowerCase()}
                          id={`gender-${choice}`}
                          aria-invalid={errors.gender}
                        />
                        <FieldLabel
                          htmlFor={`gender-${choice}`}
                          className="font-normal"
                        >
                          {choice}
                        </FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>
                </FieldSet>
              </div>
              <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                {/* nationality */}
                <Field data-invalid={errors.nationality} className="flex-1">
                  <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
                  <Input
                    name="nationality"
                    type="text"
                    placeholder="Nationality"
                    onChange={(e) => {
                      handleChange(e);
                      emitActivity();
                    }}
                    value={form.nationality}
                    aria-invalid={errors.nationality}
                  />
                  {errors.nationality && (
                    <FieldDescription>This field is required</FieldDescription>
                  )}
                </Field>
                {/* language */}
                <FieldSet className="flex-1">
                  <FieldLabel htmlFor="language">Language</FieldLabel>
                  {errors.language && (
                    <FieldDescription>This field is required</FieldDescription>
                  )}
                  <RadioGroup
                    value={form.language}
                    onValueChange={(value) => {
                      handleValueChange("language", value);
                      emitActivity();
                    }}
                    className="w-fit flex flex-col sm:flex-row sm:gap-6"
                  >
                    {languageChoices.map((choice, index) => (
                      <Field
                        key={index}
                        orientation="horizontal"
                        data-invalid={errors.language}
                      >
                        <RadioGroupItem
                          value={choice.toLowerCase()}
                          id={`language-${choice}`}
                          aria-invalid={errors.language}
                        />
                        <FieldLabel
                          htmlFor={`language-${choice}`}
                          className="font-normal"
                        >
                          {choice}
                        </FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>
                </FieldSet>
              </div>
              <div className="lg:flex lg:gap-10">
                {/* religion */}
                <Field className="lg:flex-1">
                  <FieldLabel htmlFor="religion">
                    Religion (Optional)
                  </FieldLabel>
                  <Input
                    name="religion"
                    type="text"
                    placeholder="Religion"
                    onChange={(e) => {
                      handleChange(e);
                      emitActivity();
                    }}
                    value={form.religion}
                  />
                </Field>
                <div className="lg:flex-1" />
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Contact Information</FieldLegend>
            <FieldGroup className="m-5 w-auto">
              <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                {/* phoneNumber */}
                <Field data-invalid={errors.phoneNumber} className="flex-1">
                  <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                  <Input
                    name="phoneNumber"
                    type="tel"
                    placeholder="0XXXXXXXXX"
                    onChange={(e) => {
                      handleChange(e);
                      emitActivity();
                    }}
                    value={form.phoneNumber}
                    aria-invalid={errors.phoneNumber}
                  />
                  {errors.phoneNumber && (
                    <FieldDescription>
                      Please enter a 10-digit phone number.
                    </FieldDescription>
                  )}
                </Field>
                {/* email */}
                <Field data-invalid={errors.email} className="flex-1">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    name="email"
                    type="text"
                    placeholder="name@example.com"
                    onChange={(e) => {
                      handleChange(e);
                      emitActivity();
                    }}
                    value={form.email}
                    aria-invalid={errors.email}
                  />
                  {errors.email && (
                    <FieldDescription>
                      Please enter a valid email address (e.g.,
                      name@example.com).
                    </FieldDescription>
                  )}
                </Field>
              </div>
              {/* address */}
              <Field data-invalid={errors.address}>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  name="address"
                  type="text"
                  placeholder="Address"
                  onChange={(e) => {
                    handleChange(e);
                    emitActivity();
                  }}
                  value={form.address}
                  aria-invalid={errors.address}
                />
                {errors.address && (
                  <FieldDescription>This field is required</FieldDescription>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          {/* emergencyContact */}
          <FieldSet>
            <FieldLegend>Emergency Contact (Optional)</FieldLegend>
            <FieldGroup className="m-5 w-auto">
              {/* Name */}
              <Field>
                <FieldLabel htmlFor="emergencyContact.name">Name</FieldLabel>
                <Input
                  name="emergencyContact.name"
                  type="text"
                  placeholder="Name"
                  onChange={(e) => {
                    handleChange(e);
                    emitActivity();
                  }}
                  value={form.emergencyContact.name}
                />
              </Field>
              <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                {/* Relationship */}
                <Field className="flex-1">
                  <FieldLabel htmlFor="emergencyContact.relationship">
                    Relationship
                  </FieldLabel>
                  <Input
                    name="emergencyContact.relationship"
                    type="text"
                    placeholder="Relationship"
                    onChange={(e) => {
                      handleChange(e);
                      emitActivity();
                    }}
                    value={form.emergencyContact.relationship}
                  />
                </Field>
                {/* Phone Number */}
                <Field className="flex-1">
                  <FieldLabel htmlFor="emergencyContact.emergencyPhone">
                    Phone Number
                  </FieldLabel>
                  <Input
                    name="emergencyContact.emergencyPhone"
                    type="tel"
                    placeholder="0XXXXXXXXX"
                    onChange={(e) => {
                      handleChange(e);
                      emitActivity();
                    }}
                    value={form.emergencyContact.emergencyPhone}
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" className="ml-auto mt-[0.5rem] w-fit">
            Submit
          </Button>
        </FieldGroup>
      </form>
    </>
  );
}
