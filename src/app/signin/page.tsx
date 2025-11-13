'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import TopBar from '@/components/TopBar'
import Wrapper from '@/components/Wrapper'
import Link from 'next/link'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/zustand/authStore'
import { Eye, EyeOff } from 'lucide-react'
import { LogoutButton } from '@/components/Logout'
import { SchoolSelectionModal, RoleSelectionModal } from '@/components/SchoolSelectionModal'
import { School, Role } from '@/types'
import { LAST_PAGE_VISITED_BEFORE_AUTH } from "@/constants";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [schoolsData, setSchoolsData] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { login, completeLogin, isLoading } = useAuthStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setShowSchoolModal(false);
    setShowRoleModal(true);
  };

  const handleRoleSelect = async (role: Role) => {
    const values = form.getValues();
    const result = await completeLogin(
      values.email,
      values.password,
      selectedSchool!.schoolId._id,
      role
    );

    if (result.success) {
      toast({
        title: "Login successful",
        description: "You're being redirected to your dashboard",
      });

      console.log(result);

      // Redirect based on role
      switch (role) {
        case "superAdmin":
          router.push("/admin/overview");
          break;
        case "parent":
          router.push("/parent");
          break;
        case "teacher":
          router.push("/staff");
          break;
        case "student":
          router.push("/student");
          break;
        default:
          router.push("/");
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: result.error || "An error occurred",
      });
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await login(data.email, data.password);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: result.error || "Invalid email or password",
      });
      return;
    }

    if (result.requiresOnboarding) {
      // Save first access token
      if (typeof window !== "undefined") {
        document.cookie = `auth-token=${result.accessToken}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; Secure; SameSite=Strict`;
      }
      // 2. Optionally save to auth store (without user data)
      useAuthStore.setState({
        token: result.accessToken,
        isAuthenticated: true,
        error: null,
      });

      // 3. Redirect to onboarding
      router.push("/onboarding");
      return;
    }

    // Handle case where we already have user data (new format)
    if (result.user && result?.role) {
      useAuthStore.setState({
        token: result.accessToken,
        isAuthenticated: true,
        user: result.user,
        error: null,
      });
      const lastPage =
        typeof window !== "undefined"
          ? localStorage.getItem(LAST_PAGE_VISITED_BEFORE_AUTH)
          : null;

      if (lastPage) {
        localStorage.removeItem(LAST_PAGE_VISITED_BEFORE_AUTH);
        router.push(lastPage);
        return;
      }

      // Redirect based on role
      switch (result?.role) {
        case "superAdmin":
          router.push("/admin/compulsory");
          break;
        case "parent":
          router.push("/parent");
          break;
        case "teacher":
          router.push("/staff");
          break;
        case "student":
          router.push("/student");
          break;
        default:
          router.push("/");
      }
      return;
    }

    if (!result.requiresSecondStep && result.role) {
      // Auto-redirect for single school/single role
      switch (result.role) {
        case "superAdmin":
          router.push("/admin/compulsory");
          break;
        case "parent":
          router.push("/parent");
          break;
        case "teacher":
          router.push("/staff");
          break;
        case "student":
          router.push("/student");
          break;
        default:
          router.push("/");
      }
      return;
    }

    // Show selection modals
    if (result.schools) {
      setSchoolsData(result.schools);

      // If only one school but multiple roles, skip school selection
      if (result.schools.length === 1) {
        setSelectedSchool(result.schools[0]);
        setShowRoleModal(true);
      } else {
        setShowSchoolModal(true);
      }
    }
  }

  return (
    <MaxWidthWrapper>
      <TopBar text="New to SQOOLIFY?" btnText="Sign Up" />
      <LogoutButton />
      <Wrapper className="h-full max-w-[450px] w-full mx-auto gap-4 mt-[4rem] sm:mt-[4rem]">
        <div className="text-center mb-8">
          <h3 className="text-primary text-2xl sm:text-3xl mb-4">
            Welcome Back!
          </h3>
          <p className="text-[#434547]">Login to visit your dashboard</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center">
              <Link href="/resetpassword" className="text-sm text-[#434547]">
                Forgot password?
              </Link>
            </div>
          </form>
        </Form>
      </Wrapper>

      <SchoolSelectionModal
        open={showSchoolModal}
        onOpenChange={setShowSchoolModal}
        schools={schoolsData}
        onSchoolSelect={handleSchoolSelect}
      />

      <RoleSelectionModal
        open={showRoleModal}
        onOpenChange={setShowRoleModal}
        school={selectedSchool}
        onRoleSelect={handleRoleSelect}
      />
    </MaxWidthWrapper>
  );
}
