"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast()


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(email.trim() === '' || password.trim() === ''){
      toast({
        title: 'Error',
        description: 'Rellena los campos antes de enviar el formulario',
        variant: 'destructive'
      })
      return
    }

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      toast({
        title: 'Error',
        description: 'Datos incorrectos',
        variant: 'destructive'
      })
      return
    }

    router.push("/dashboard");
  };

  return (
<div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
      <CardContent>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          className="form-control mb-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Label>Contraseña:</Label>
        <Input
          type="password"
          name="password"
          className="form-control mb-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Login</Button>
      </CardFooter>
      </form>

      <a href="/register" className="p-2 text-blue-500 underline">¿Aún no tienes cuenta?</a>
    </Card>
    </div>
  );
};
export default LoginPage;
