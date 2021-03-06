import { HttpException, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';

export default class DB {
    static toObjectID(id: string, type: string) {
        try {
            if (!id) throw '';
            return mongoose.Types.ObjectId.createFromHexString(id);
        } catch (err) {
            throw new HttpException(`Geçersiz ${type} IDsi`, HttpStatus.BAD_REQUEST);
        }
    }

    static toTime(id: mongoose.Types.ObjectId) {
        return parseInt(id.toString().substring(0, 8), 16);
    }
}
