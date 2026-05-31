import {
  useState,
  useEffect,
  useOptimistic,
  useActionState,
  useRef,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProfile, updateProfile } from "@/lib/api";
import { useAuthStore } from "@/features/auth/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import type { User, Address } from "@/types";

type ProfileFormState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "error"; message: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validate(fields: {
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  city: string;
  postcode: string;
  country: string;
}): string | null {
  if (!fields.firstName.trim()) return "First name is required.";
  if (!fields.lastName.trim()) return "Last name is required.";
  if (!fields.line1.trim()) return "Address is required.";
  if (!fields.city.trim()) return "City is required.";
  if (!fields.postcode.trim()) return "Postcode is required.";
  if (!fields.country.trim()) return "Country is required.";
  if (
    fields.phone.trim() &&
    !/^\+?[\d\s\-().]{7,20}$/.test(fields.phone.trim())
  ) {
    return "Enter a valid phone number.";
  }
  return null;
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export function ProfilePage() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Server state ───────────────────────────────────────────────
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
  });

  // ── Optimistic display (avatar initials + heading name) ────────
  const [optimisticProfile, setOptimisticProfile] = useOptimistic(
    profile ?? null,
    (_: User | null, next: User) => next,
  );

  // ── Tooltip state ──────────────────────────────────────────────
  const [emailTooltipOpen, setEmailTooltipOpen] = useState(false);

  // ── Avatar preview ─────────────────────────────────────────────
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // ── Controlled form fields ─────────────────────────────────────
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    postcode: "",
    country: "",
  });

  // Sync fields when profile first loads (or after external update)
  useEffect(() => {
    if (profile) {
      setFields({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone ?? "",
        line1: profile.address?.line1 ?? "",
        line2: profile.address?.line2 ?? "",
        city: profile.address?.city ?? "",
        postcode: profile.address?.postcode ?? "",
        country: profile.address?.country ?? "",
      });
    }
  }, [profile]);

  // ── Form action ────────────────────────────────────────────────
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    async () => {
      const {
        firstName,
        lastName,
        phone,
        line1,
        line2,
        city,
        postcode,
        country,
      } = fields;
      const error = validate({
        firstName,
        lastName,
        phone,
        line1,
        city,
        postcode,
        country,
      });
      if (error) return { status: "error", message: error };

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        address: {
          line1: line1.trim(),
          ...(line2.trim() ? { line2: line2.trim() } : {}),
          city: city.trim(),
          postcode: postcode.trim(),
          country: country.trim(),
        } satisfies Partial<Address>,
      };

      // Optimistic update — visible immediately during the pending transition
      if (profile) {
        setOptimisticProfile({
          ...profile,
          ...payload,
          address: {
            ...(profile.address ?? {}),
            ...payload.address,
          } as Address,
        });
      }

      try {
        const updated = await updateProfile(payload);
        updateUser(updated);
        queryClient.setQueryData<User>(["profile"], updated);
        return { status: "saved" };
      } catch (err) {
        return {
          status: "error",
          message:
            err instanceof Error
              ? err.message
              : "Update failed. Please try again.",
        };
      }
    },
    { status: "idle" },
  );

  // ── Loading skeleton ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-56 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="size-20 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-28 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                <div className="h-10 rounded-md bg-muted animate-pulse" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-28 rounded bg-muted animate-pulse" />
            <div className="h-10 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ── Page ───────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-0.5">
          Manage your personal information.
        </p>
      </header>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="size-20 rounded-full bg-brand-100 text-brand-700 text-2xl font-bold flex items-center justify-center hover:bg-brand-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Change profile photo"
        >
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Profile photo"
              className="size-20 rounded-full object-cover"
            />
          ) : (
            optimisticProfile
              ? `${optimisticProfile.firstName.charAt(0)}${optimisticProfile.lastName.charAt(0)}`.toUpperCase()
              : "?"
          )}
        </button>
        <p className="text-xs text-muted-foreground">Click to change photo</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-hidden="true"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
          }}
        />
      </div>

      {state.status === "saved" && (
        <div className="flex items-center gap-2 rounded-md bg-success-50 border border-success-200 px-4 py-3 text-sm text-success-700">
          <CheckCircle2 className="size-4 shrink-0" />
          Profile updated successfully.
        </div>
      )}
      {state.status === "error" && (
        <div className="rounded-md bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-700">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-8">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-sm font-semibold text-foreground">
              Personal information
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={fields.firstName}
                  onChange={(e) =>
                    setFields((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={fields.lastName}
                  onChange={(e) =>
                    setFields((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Tooltip open={emailTooltipOpen}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setEmailTooltipOpen((o) => !o)}
                        className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        aria-label="Why can't I edit my email?"
                      >
                        <Info className="size-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Email changes affect your login credentials. Contact
                      support to update your email address.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={fields.email}
                  autoComplete="email"
                  disabled
                  className="disabled:opacity-60 disabled:cursor-not-allowed bg-muted"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="phone">
                    Phone{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={fields.phone}
                  onChange={(e) =>
                    setFields((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-sm font-semibold text-foreground">Address</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="line1">Address line 1</Label>
              <Input
                id="line1"
                name="line1"
                value={fields.line1}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, line1: e.target.value }))
                }
                autoComplete="address-line1"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="line2">
                Address line 2{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="line2"
                name="line2"
                value={fields.line2}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, line2: e.target.value }))
                }
                autoComplete="address-line2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={fields.city}
                  onChange={(e) =>
                    setFields((prev) => ({ ...prev, city: e.target.value }))
                  }
                  autoComplete="address-level2"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  name="postcode"
                  value={fields.postcode}
                  onChange={(e) =>
                    setFields((prev) => ({ ...prev, postcode: e.target.value }))
                  }
                  autoComplete="postal-code"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={fields.country}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, country: e.target.value }))
                }
                autoComplete="country-name"
              />
            </div>
          </CardContent>
        </Card>

        <SubmitButton
          label="Save changes"
          pendingLabel="Saving…"
          cssClass="w-40"
        />
      </form>
    </div>
  );
}
