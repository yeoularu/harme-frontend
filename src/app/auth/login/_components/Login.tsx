"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { z } from "zod";

const formSchema = z.object({
  nickName: z
    .string()
    .min(1, {
      message: "별명을 입력해주세요.",
    })
    .regex(/^[a-zA-Z0-9가-힣]+$/, {
      message: "별명은 한글, 영어, 숫자만 포함할 수 있습니다.",
    }),
  password: z.string().length(4, {
    message: "비밀번호는 숫자 4자리여야 합니다.",
  }),
});

export default function Login() {
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);
  const [_, setUser] = useLocalStorage<User | undefined>("user", undefined);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: "",
      password: "",
    },
  });

  const passwordLength = form.watch("password").length;

  console.log(form.watch("password"));
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error during signup:", errorData);
        toast.error("로그인이 실패했습니다. 별명과 비밀번호를 확인해주세요.");
        return;
      }
      const user = await response.json();
      setUser(user);
      router.push("/");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("로그인이 실패했습니다. 별명과 비밀번호를 확인해주세요.");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nickName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">별명</FormLabel>
              <FormControl>
                <Input placeholder="별명을 입력해주세요" {...field} />
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
              <FormLabel className="text-xl">비밀번호</FormLabel>
              <FormControl>
                <div className="group relative">
                  <InputOTP maxLength={4} {...field} className="z-30">
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className={isShow ? "" : "text-transparent"}
                      />
                      <InputOTPSlot
                        index={1}
                        className={isShow ? "" : "text-transparent"}
                      />
                      <InputOTPSlot
                        index={2}
                        className={isShow ? "" : "text-transparent"}
                      />
                      <InputOTPSlot
                        index={3}
                        className={isShow ? "" : "text-transparent"}
                      />
                    </InputOTPGroup>
                  </InputOTP>
                  <div className="absolute top-0">
                    <InputOTP
                      maxLength={4}
                      inputMode="text"
                      pattern="^\*+$"
                      value={"*".repeat(passwordLength)}
                      type="text"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className={!isShow ? "" : "text-transparent"}
                        />
                        <InputOTPSlot
                          index={1}
                          className={!isShow ? "" : "text-transparent"}
                        />
                        <InputOTPSlot
                          index={2}
                          className={!isShow ? "" : "text-transparent"}
                        />
                        <InputOTPSlot
                          index={3}
                          className={!isShow ? "" : "text-transparent"}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 z-50 my-auto text-[#C0C0C0] hover:bg-transparent group-hover:text-gray-500"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsShow((v) => !v);
                    }}
                  >
                    {isShow ? <EyeIcon /> : <EyeOffIcon />}
                  </Button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4 flex flex-col items-start gap-2">
          <Button className="w-full text-base" size="lg" type="submit">
            로그인
          </Button>
          <Button
            variant="link"
            className="pl-1 text-[#A3A3A3] underline"
            asChild
          >
            <Link href="/auth/signup">회원가입</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
