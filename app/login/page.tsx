import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: 'Login | LMS Komandro',
  description: 'Login page for LMS Komandro'
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute inset-0 bg-blue-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white dark:border-r lg:flex">
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/placeholder.svg"
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          LMS Komandro
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Platform pembelajaran yang dirancang untuk membantu Anda menguasai pemrograman dengan cara yang efektif dan terstruktur.&rdquo;
            </p>
            <footer className="text-sm">Komandro Team</footer>
          </blockquote>
        </div>
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-zinc-900/50" />
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            {/* Mobile Logo - Only shown on small screens */}
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <Image
                src="/placeholder.svg"
                alt="Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <h1 className="text-2xl font-semibold tracking-tight">
                LMS Komandro
              </h1>
            </div>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Hubungi administrator jika mengalami kendala saat login
          </p>
        </div>
      </div>
    </div>
  )
} 