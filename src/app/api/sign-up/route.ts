import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEnail";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { email, password, username } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, {
                status: 400
            });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email already registered"
                }, {
                    status: 400
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hassedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            // const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            const newUser = new UserModel({
                username,
                email,
                password: hassedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                message: []
            });

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error while user Registration : ", error);
        return Response.json({
            success: false,
            message: "error registering user"
        }, {
            status: 500
        })
    }
}