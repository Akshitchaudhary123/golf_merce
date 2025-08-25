import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    async uploadStream(fileBuffer: Buffer): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'uploads' }, // optional: save in a Cloudinary folder
                (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Cloudinary result is undefined'));
                    resolve(result);
                },
            );

            // Convert Buffer → ReadableStream → pipe into Cloudinary
            const readable = new Readable();
            readable.push(fileBuffer);
            readable.push(null);
            readable.pipe(uploadStream);
        });
    }
}
