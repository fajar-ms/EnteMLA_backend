import { BadRequestException, Injectable, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService implements OnModuleInit {

    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    // Runs when application starts
    async onModuleInit() {
        console.log("✅ AuthService initialized - Using your own MongoDB MLA data");
    }
    async syncMlaDirectory() {
        console.log("🔄 Manual MLA sync triggered (currently disabled)");
    }

    // ====================== AUTH METHODS ======================

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

    // Helper method to get all MLAs (you can use this in other services)
    async getAllMlas() {
        return this.userModel.find({ role: 'mla' }).select('-password').lean();
    }

    // Helper method to search MLA
    async findMlaByKeyword(keyword: string) {
        const regex = new RegExp(keyword, 'i');
        return this.userModel.findOne({
            role: 'mla',
            $or: [
                { name: regex },
                { constituency: regex }
            ]
        }).select('-password').lean();
    }
}
