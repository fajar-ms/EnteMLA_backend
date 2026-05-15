import { BadRequestException, Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async onModuleInit() {
        await this.seedMLA();
    }

    async seedMLA() {
        const mlaEmail = "mla.official@government.in"; // Using your consistent official email

        try {
            const existingMLA = await this.userModel.findOne({ email: mlaEmail });

            if (!existingMLA) {
                console.log('🚀 Seeding MLA details into database...');

                const mlaData = {
                    name: "Hon. MLA Name",
                    email: mlaEmail,
                    password: "qwerty123456", // ⚠️ In production, use bcrypt to hash this!
                    phone: "9876543210",
                    district: "Ernakulam",
                    constituency: "Greenfield Constituency",
                    place: "Kochi", 
                    role: "mla"
                };

                const mla = new this.userModel(mlaData);
                await mla.save();
                console.log('✅ MLA seeded successfully!');
            } else {
                console.log('✅ MLA already exists in database.');
            }
        } catch (error: any) {
            if (error.code === 11000) {
                console.log('✅ MLA already exists (duplicate key handled).');
            } else {
                console.error('❌ Error seeding MLA:', error.message);
            }
        }
    }

    async register(dto: RegisterDto) {
        const existing = await this.userModel.findOne({ email: dto.email });
        if (existing) {
            throw new BadRequestException('Email already exists');
        }
        const newUser = new this.userModel(dto);
        return newUser.save();
    }

    async login(loginDto: any) {
        const user = await this.userModel.findOne({ email: loginDto.email });

        if (!user || user.password !== loginDto.password) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (user.role !== loginDto.role) {
            throw new UnauthorizedException(`Access Denied: You are not registered as ${loginDto.role}`);
        }

        return {
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                district: user.district,
                constituency: user.constituency,
                place: user.place,
                role: user.role
            }
        };
    }
}