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
import { Loader2Icon } from "lucide-react";
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
  const [_, setUser] = useLocalStorage<User | undefined>("user", undefined);

  const [isCheckingNickName, setIsCheckingNickName] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: "",
      password: "",
    },
  });

  const nickNameInputValue = form.watch("nickName");
  const [debouncedValue, setValue] = useDebounceValue("", 1000);

  useEffect(() => {
    setValue(nickNameInputValue);
    form.clearErrors("nickName");
    setIsCheckingNickName(nickNameInputValue.length > 0);
  }, [nickNameInputValue, setValue, form]);

  const { data, error } = useSWR(
    debouncedValue.length > 0
      ? `/api/duplecate?nickName=${debouncedValue}`
      : null,
    fetcher,
  );

  useEffect(() => {
    if (data === 200) {
      form.setError("nickName", {
        message: "중복된 별명입니다. 다른 별명을 입력해주세요.",
      });
    } else if (data === 404) {
      form.clearErrors("nickName");
    } else if (data) {
      form.setError("nickName", {
        message: "별명 확인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.",
      });
    }
    setIsCheckingNickName(false);
  }, [data, error, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (data === 200) {
      form.setError("nickName", {
        message: "중복된 별명입니다. 다른 별명을 입력해주세요.",
      });
      return;
    }
    if (isCheckingNickName) {
      return;
    }

    try {
      const response = await fetch("/api/signup", {
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

      setUser(values);
      router.push("/");
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
              {isCheckingNickName && (
                <Loader2Icon className="ml-1 h-4 w-4 animate-spin text-primary" />
              )}
              {field.value.length > 0 &&
                !isCheckingNickName &&
                data === 404 && (
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
                <InputOTP maxLength={4} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>숫자를 입력해주세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <Button className="text-base" variant="link" asChild>
            <Link href="/auth/login">로그인</Link>
          </Button>
          <Button
            className="text-base"
            type="submit"
            disabled={isCheckingNickName}
          >
            회원가입
          </Button>
        </div>
      </form>
    </Form>
  );
}
