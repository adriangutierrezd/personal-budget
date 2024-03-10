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

const RegisterPage = () => {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeatPassword, setRepeatPassword] = useState<string>('')
    const router = useRouter();
    const {toast} = useToast()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sign-up`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name, 
                email, 
                password
            })
        })

        if(data.status != 200){
            toast({
                title: 'Error',
                description: 'Ha ocurrido un error',
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
                description: 'Ha ocurrido un error',
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
                    <CardTitle>Registro</CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <Label>Nombre</Label>
                        <Input
                            type="text"
                            name="name"
                            className="form-control mb-2"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                        <Label>Email</Label>

                        <Input
                            type="email"
                            name="email"
                            className="form-control mb-2"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <Label>Contraseña</Label>

                        <Input
                            type="password"
                            name="password"
                            className="form-control mb-2"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <Label>Repetir contraseña</Label>

                        <Input
                            type="password"
                            name="repeat-password"
                            className="form-control mb-2"
                            value={repeatPassword}
                            onChange={(event) => setRepeatPassword(event.target.value)}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button>Crear cuenta</Button>
                    </CardFooter>
                </form>
                <a href="/login" className="p-2 text-blue-500 underline">¿Ya tienes una cuenta?</a>

            </Card>
        </div>
    );
};
export default RegisterPage;
