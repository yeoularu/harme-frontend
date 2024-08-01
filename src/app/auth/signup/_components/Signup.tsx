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
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import { useDebounceValue, useLocalStorage } from "usehooks-ts";
import { z } from "zod";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.status;
};

const formSchema = z.object({
  nickName: z
    .string()
    .min(1, {
      message: "사용할 별명을 입력해주세요.",
    })
    .regex(/^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]+$/, {
      message: "별명은 한글(자모음 포함), 영어, 숫자만 포함할 수 있습니다.",
    }),
  password: z.string().length(4, {
    message: "비밀번호 4자리를 모두 입력해주세요.",
  }),
});

export default function Signup() {
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);

  const [_, setUser] = useLocalStorage<User | undefined>("user", undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: "",
      password: "",
    },
  });
  const passwordLength = form.watch("password").length;

  const nickNameInputValue = form.watch("nickName");

  useEffect(() => {
    form.clearErrors("nickName");
  }, [nickNameInputValue, form]);

  const { data, error, isLoading } = useSWR(
    nickNameInputValue.length > 0
      ? `/api/user/duplicate?nickName=${nickNameInputValue}`
      : null,
    fetcher,
  );

  useEffect(() => {
    if (data === 404) {
      form.setError("nickName", {
        message: "중복된 별명입니다. 다른 별명을 입력해주세요.",
      });
    } else if (data === 200) {
      form.clearErrors("nickName");
    } else if (data) {
      form.setError("nickName", {
        message: "별명 확인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.",
      });
    }
  }, [data, error, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (data === 404) {
      form.setError("nickName", {
        message: "중복된 별명입니다. 다른 별명을 입력해주세요.",
      });
      return;
    }
    if (isLoading) {
      return;
    }

    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error during signup:", errorData);
        toast.error("문제가 발생했습니다. 나중에 다시 시도해주세요.");
        return;
      }

      toast.success("회원가입 성공. 로그인하세요.");
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("문제가 발생했습니다. 나중에 다시 시도해주세요.");
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
              {isLoading && (
                <Loader2Icon className="ml-1 h-4 w-4 animate-spin text-primary" />
              )}
              {field.value.length > 0 && !isLoading && data === 200 && (
                <p className="text-sm font-medium text-green-500">
                  사용 가능한 별명입니다.
                </p>
              )}
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
              <FormDescription>숫자를 입력해주세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full text-base" size="lg" type="submit">
          회원가입
        </Button>
      </form>
    </Form>
  );
}
